const IdeaModel = require("../models/Idea.Model");
const asyncHandler = require("../utils/asyncHandler");
const UserModel = require("../models/User.Model");
const { genAI } = require("../config/GenAIModel");
const axios = require("axios");
exports.createIdea = asyncHandler(async (req, res) => {
  const {
    businessName,
    industry,
    businessDescription,
    targetMarket,
    targetMarketSize,
    uniqueSellingProposition,
    problem,
    solution,
    businessModel,
    fundingRequired,
    equityOffered,
    foundedYear,
    uspStrength,
    teamExperience,
  } = req.body;

  var predictingFields = {
    problemImportance: 0,
    solutionUniqueness: 0,
    businessModelClarity: 0,
  };
  const prompt = `
You are an expert startup evaluator and language model. You will receive a business idea submission and must do **two things**:

1. **Validate** each field to check if it contains **meaningful, clear, non-gibberish information**.
2. If valid, return ratings between 1 and 10 for:
   - "problemImportance"
   - "solutionUniqueness"
   - "businessModelClarity"

If **any field appears meaningless, irrelevant, or gibberish**, set \`"invalid": true\` and add a descriptive \`"errorMessage"\` mentioning which fields are invalid.

Business Details:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${businessDescription}
- Target Market: ${targetMarket}
- Target Market Size: ${targetMarketSize}
- Unique Selling Proposition: ${uniqueSellingProposition}
- Problem: ${problem}
- Solution: ${solution}
- Business Model: ${businessModel}
- Funding Required: ${fundingRequired}
- Equity Offered: ${equityOffered}
- Founded Year: ${foundedYear}
- USP Strength (1–10): ${uspStrength}
- Team Experience (in years): ${teamExperience}

👉 Respond in **JSON only**, no explanations, no markdown, no formatting. Use this format:

{
  "problemImportance": int,
  "solutionUniqueness": int,
  "businessModelClarity": int,
  "invalid": boolean,
  "errorMessage": string (if invalid)
}
`;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Gemini response:", text);
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Cleaned response:", cleanText);
    // Try to parse response
    const ratings = JSON.parse(cleanText);
    console.log("Ratings from AI:", ratings);

    if (ratings.invalid) {
      throw new Error(ratings.errorMessage || "Input are not valid");
    }
    predictingFields.problemImportance = ratings.problemImportance;
    predictingFields.solutionUniqueness = ratings.solutionUniqueness;
    predictingFields.businessModelClarity = ratings.businessModelClarity;
  } catch (err) {
    if (err.message.includes("429")) {
      throw new Error(
        "You have hit the rate limit of Gemini. Try again later."
      );
    }
    throw new Error(err.message || "Failed to validate idea details");
  }

  // Request to model for suceess rate prediction
  const features = {
    category_code: industry,
    funding_required: fundingRequired,
    founded_year: foundedYear,
    problem_importance: predictingFields.problemImportance,
    solution_uniqueness: predictingFields.solutionUniqueness,
    usp_strength: uspStrength,
    business_model_clarity: predictingFields.businessModelClarity,
    team_experience_years: teamExperience,
    equity_offered: equityOffered,
    target_market_size: Math.log1p(targetMarketSize),
  };

  console.log("Features for model:", features);
  // Make sure the model server is running at this URL
  const modelResponse = await axios.post("http://localhost:8000/predict", {
    features,
  });

  const successRate = modelResponse.data.success_probability * 100;
  console.log("Success rate from model:", successRate);
  const idea = await IdeaModel.create({
    businessName,
    industry,
    businessDescription,
    targetMarket,
    targetMarketSize,
    uniqueSellingProposition,
    problem,
    solution,
    businessModel,
    fundingRequired,
    equityOffered,
    foundedYear,
    uspStrength,
    teamExperience,
    problemImportance: predictingFields.problemImportance,
    solutionUniqueness: predictingFields.solutionUniqueness,
    businessModelClarity: predictingFields.businessModelClarity,
    successRate: successRate.toFixed(2),
    submitter: req.user._id, // Assuming req.user is populated with the authenticated user
  });

  res.status(201).json({
    success: true,
    data: idea,
  });
});
// const e = {
//   businessName: "GreenNest",
//   industry: "Sustainable Living",
//   businessDescription:
//     "GreenNest is an eco-friendly startup that designs and sells smart home systems focused on reducing energy consumption and carbon footprint.",
//   targetMarket: "Environmentally conscious homeowners and small businesses",
//   targetMarketSize:
//     "Over 20 million homes in urban areas globally looking for sustainable upgrades",
//   uniqueSellingProposition:
//     "GreenNest integrates solar, water, and energy-saving devices into one unified system with real-time analytics via a mobile app.",
//   problem:
//     "Most homes are not energy-efficient, and homeowners lack tools to track or reduce their energy consumption effectively.",
//   solution:
//     "An all-in-one smart system that monitors and optimizes energy, water, and heating usage while using green tech.",
//   businessModel:
//     "Direct-to-consumer sales via e-commerce, with optional installation and subscription for analytics services.",
//   fundingRequired: 250000,
//   equityOffered: 10,
//   foundedYear: 2023,
//   uspStrength: 9,
//   teamExperience: 5,
//   problemImportance: 0,
//   solutionUniqueness: 0,
//   businessModelClarity: 0,
//   successRate: 0,
// };

exports.getAllIdeas = asyncHandler(async (req, res) => {
  // Sorted by success rate in descending order

  const ideas = await IdeaModel.find()
    .populate({
      path: "submitter",
      select: "fullName _id  profilePicture",
    })
    .sort({ successRate: -1 });

  res.status(200).json({
    success: true,
    data: ideas,
  });
});

exports.getMyIdeas = asyncHandler(async (req, res) => {
  const ideas = await IdeaModel.find({ submitter: req.user._id })
    .populate({
      path: "submitter",
      select: "fullName _id  profilePicture",
    })
    .sort({ successRate: -1 });

  res.status(200).json({
    success: true,
    data: ideas,
  });
});

exports.getIdeaById = asyncHandler(async (req, res) => {
  const idea = await IdeaModel.findById(req.params.id).populate([
    {
      path: "submitter",
      select: "fullName _id profilePicture email",
    },
    {
      path: "assignedTo",
      select: "fullName _id profilePicture email",
    },
  ]);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: "Idea not found",
    });
  }

  res.status(200).json({
    success: true,
    data: idea,
  });
});

exports.changeIdeaStatus = asyncHandler(async (req, res) => {
  const { email, ideaId, status } = req.body;

  let user = null;
  if (email) {
    user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found with this email");
    }
  }

  const idea = await IdeaModel.findById(ideaId).populate({
    path: "submitter",
    select: "fullName _id  profilePicture profilePicture",
  });

  if (!idea) {
    throw new Error("Idea not found");
  }
  if (!email) {
    idea.assignedTo = null;
  }
  idea.status = status;
  idea.assignedTo = user?._id || null;

  await idea.save();

  return res.status(200).json({
    success: true,
    data: idea,
  });
});
