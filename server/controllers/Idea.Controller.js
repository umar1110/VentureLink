const IdeaModel = require("../models/Idea.Model");
const asyncHandler = require("../utils/asyncHandler");

exports.createIdea = asyncHandler(async (req, res) => {
  const idea = await IdeaModel.create({ ...req.body, submitter: req.user._id });

  res.status(201).json({
    success: true,
    data: idea,
  });
});

exports.getAllIdeas = asyncHandler(async (req, res) => {
  const ideas = await IdeaModel.find().populate({
    path: "submitter",
    select: "fullName _id ",
  });

  res.status(200).json({
    success: true,
    data: ideas,
  });
});

exports.getMyIdeas = asyncHandler(async (req, res) => {
  const ideas = await IdeaModel.find({ submitter: req.user._id }).populate({
    path: "submitter",
    select: "fullName _id ",
  });

  res.status(200).json({
    success: true,
    data: ideas,
  });
});

exports.getIdeaById = asyncHandler(async (req, res) => {
  const idea = await IdeaModel.findById(req.params.id).populate({
    path: "submitter",
    select: "fullName _id ",
  });

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
