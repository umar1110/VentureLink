// Message Controller

const ChatMessage = require("../models/ChatMessage.Model");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const messages = await ChatMessage.find({ chatId })
    .populate("sender", "fullName email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: messages,
  });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user._id;

  if (!chatId || !text) {
    return res.status(400).json({
      success: false,
      message: "Chat ID and text are required",
    });
  }

  const newMessage = await ChatMessage.create({
    chatId,
    sender: senderId,
    text,
  });

  await newMessage.populate("sender", "fullName email");

  res.status(201).json({
    success: true,
    data: newMessage,
  });
});
