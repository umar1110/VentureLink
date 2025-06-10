const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
  createIdea,
  getMyIdeas,
  getAllIdeas,
  getIdeaById,
} = require("../controllers/Idea.Controller");

const router = express.Router();

router.post("/idea/create", isAuthenticatedUser, createIdea);
router.get("/my/ideas", isAuthenticatedUser, getMyIdeas);
router.get("/ideas", isAuthenticatedUser, getAllIdeas);
router.get("/ideas/:id", isAuthenticatedUser, getIdeaById);
module.exports = router;
