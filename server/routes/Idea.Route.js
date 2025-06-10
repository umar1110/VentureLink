const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { createIdea } = require("../controllers/Idea.Controller");

const router = express.Router();

router.post("/idea/create", isAuthenticatedUser, createIdea);
module.exports = router;
