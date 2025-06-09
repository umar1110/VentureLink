const express = require("express");
const {
  getAllMessages,
  sendMessage,
} = require("../controllers/ChatMessage.Controller");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.get("/messages/:chatId", getAllMessages);
router.post("/message/send", isAuthenticatedUser, sendMessage);
module.exports = router;
