const express = require("express");
const { getAllChats, createChat } = require("../controllers/Chat.Controllers");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.get("/chats/:userId", isAuthenticatedUser, getAllChats);
router.post("/chat/create", isAuthenticatedUser, createChat);

module.exports = router;
