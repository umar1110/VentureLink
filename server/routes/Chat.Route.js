const express = require("express");
const { getAllChats, createChat } = require("../controllers/Chat.Controllers");
const router = express.Router();

router.get("/chats/:userId", getAllChats);
router.post("/chat/create", createChat);

module.exports = router;
