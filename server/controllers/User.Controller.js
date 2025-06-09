const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler.js");
const { sendToken } = require("../helpers/setJwtToken.js");
const User = require("../models/User.Model.js");
const {
  uploadFilesToCloudinary,
  deletFilesFromCloudinary,
} = require("../utils/uploadFilesToCloudinary.js");
exports.registerUser = asyncHandler(async (req, res) => {
  console.log("Registering user...");

  console.log(req.body);
  if (!req.file) {
    throw new ApiError(400, "Please upload a profile picture");
  }

  const { fullName, email, password, role } = req.body;

  const isExisted = await User.findOne({ email: email });
  if (isExisted) {
    throw new ApiError(400, "User already exists with this email.");
  }

  const profilePictureUpload = await uploadFilesToCloudinary([req.file]);

  const profilePicture = {
    public_id: profilePictureUpload[0].public_id,
    url: profilePictureUpload[0].url,
  };
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    profilePicture,
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

// Login User
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please enter all fields");
  }
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new ApiError(400, "Invalid Email or Password"); // 401 = unauthorized
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid Email or Password");
  }

  sendToken(user, 200, res);
});

// Update User Profile
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const { fullName, password, id } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (req.file) {
    const profilePictureUpload = await uploadFilesToCloudinary([req.file]);
    // delete old profile picture if exists

    if (user.profilePicture && user.profilePicture.public_id) {
      await deletFilesFromCloudinary([user.profilePicture.public_id]);
      console.log("Old profile picture deleted");
    }
    user.profilePicture = {
      public_id: profilePictureUpload[0].public_id,
      url: profilePictureUpload[0].url,
    };
  }

  user.fullName = fullName || user.fullName;
  if (password) {
    if (await user.comparePassword(password)) {
      throw new ApiError(
        400,
        "New password cannot be the same as old password"
      );
    }
    user.password = password;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
