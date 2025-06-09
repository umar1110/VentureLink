// Chat Controllers

const Chat = require("../models/Chat.Model");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllChats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const chats = await Chat.find({
    participants: userId,
  })
    .populate("lastMessage")
    .populate("participants", "fullName email");

  res.status(200).json({
    success: true,
    data: chats,
  });
});

exports.createChat = asyncHandler(async (req, res) => {
  const { participants } = req.body;

  // IF already exists, return the existing chat
  const existingChat = await Chat.findOne({
    participants: { $all: participants },
  });
  if (existingChat) {
    return res.status(200).json({
      success: true,
      data: existingChat,
    });
  }

  const chat = await Chat.create({
    participants,
  });
  res.status(201).json({
    success: true,
    data: chat,
  });
});
