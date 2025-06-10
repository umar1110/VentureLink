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
  const ideas = await IdeaModel.find();

  res.status(200).json({
    success: true,
    data: ideas,
  });
});
