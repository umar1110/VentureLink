const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema(
  {
    submitter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "assigned"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    businessDescription: {
      type: String,
      required: true,
      trim: true,
    },
    targetMarket: {
      type: String,
      required: true,
      trim: true,
    },
    targetMarketSize: {
      type: String,
      required: true,
      trim: true,
    },
    uniqueSellingProposition: {
      type: String,
    },
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
    },
    businessModel: {
      type: String,
      required: true,
      trim: true,
    },
    fundingRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    equityOffered: {
      // Type : Decimal
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
      max: 100,
    },
    foundedYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    uspStrength: {
      type: Number,
      required: true,
      trim: true,
    },
    targetMarketSize: {
      type: Number,
      required: true,
      trim: true,
    },
    teamExperience: {
      type: Number,
      required: true,
      trim: true,
    },
    problemImportance: {
      type: Number,
    },
    solutionUniqueness: {
      type: Number,
    },
    businessModelClarity: {
      type: Number,
    },
    fundingPerYear: {
      type: Number,
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", IdeaSchema, "ideas");
