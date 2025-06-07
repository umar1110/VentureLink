const express = require("express");
const { isAuthenticatedUser } = require("../middlewares/auth.js");
const {
  getMe,
  logout,
  registerUser,
} = require("../controllers/User.Controller.js");
const { profilePicUpload } = require("../middlewares/multermiddleware.js");
const router = express.Router();

router.get("/me", isAuthenticatedUser, getMe);
router.post("/user/register", profilePicUpload, registerUser);
router.get("/logout", logout);
module.exports = router;
