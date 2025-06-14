const IdeaModel = require("../models/Idea.Model");
const asyncHandler = require("../utils/asyncHandler");
const UserModel = require("../models/User.Model");
exports.createIdea = asyncHandler(async (req, res) => {
  const idea = await IdeaModel.create({ ...req.body, submitter: req.user._id });

  res.status(201).json({
    success: true,
    data: idea,
  });
});

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
