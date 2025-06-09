//  ChatMessage Model

const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", MessageSchema);
module.exports = ChatMessage;
