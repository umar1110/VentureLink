const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler.js");
const { sendToken } = require("../helpers/setJwtToken.js");
const User = require("../models/User.Model.js");
const {
  uploadFilesToCloudinary,
  deletFilesFromCloudinary,
} = require("../utils/uploadFilesToCloudinary.js");
exports.registerUser = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a profile picture");
  }
  console.log(req.file);

  const { fullName, email, password, role } = req.body;

  const isExisted = await User.findOne({ email: email });
  if (isExisted) {
    throw new ApiError(400, "User already exists with this email.");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    profilePicture: {
      public_id: "profilePicture.public_id",
      url: "profilePicture.url",
    },
  });

  sendToken(user, 201, res);
});

// Logout User
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//  Fetch logined user
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    user,
  });
});
