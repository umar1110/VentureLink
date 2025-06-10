const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
  createIdea,
  getMyIdeas,
  getAllIdeas,
} = require("../controllers/Idea.Controller");

const router = express.Router();

router.post("/idea/create", isAuthenticatedUser, createIdea);
router.get("/my/ideas", isAuthenticatedUser, getMyIdeas);
router.get("/ideas", isAuthenticatedUser, getAllIdeas);
module.exports = router;
