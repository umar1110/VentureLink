// Chat Controllers

const Chat = require("../models/Chat.Model");
const UserModel = require("../models/User.Model");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllChats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const chats = await Chat.find({
    participants: userId,
  })
    .populate("lastMessage")
    .populate("participants", "fullName email profilePicture");

  res.status(200).json({
    success: true,
    data: chats,
  });
});

exports.createChat = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req.user._id;
  const participants = [userId];

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Add the other user to participants
  participants.push(user._id);
  // Ensure participants are unique
  const uniqueParticipants = [...new Set(participants)];
  // Sort participants to ensure consistent order

  // IF already exists, return the existing chat
  const existingChat = await Chat.findOne({
    participants: { $all: uniqueParticipants },
  });
  if (existingChat) {
    return res.status(200).json({
      success: true,
      data: existingChat,
    });
  }

  const chat = await Chat.create({
    participants: uniqueParticipants,
  });
  const populatedChat = await Chat.findById(chat._id).populate(
    "participants",
    "fullName email profilePicture"
  );
  res.status(201).json({
    success: true,
    data: populatedChat,
  });
});
