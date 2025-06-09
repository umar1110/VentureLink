const UserModel = require("../models/User.Model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new ApiError(401, "Login To access the route.");
  }

  const decodedDataID = jwt.verify(token, process.env.JWT_SECRET);
  try {
    user = await UserModel.findById(decodedDataID.id);
    console.log("User authenticated:", user);
    if (!user) {
      throw new ApiError(401, "User Not Found, Please Login Again.");
    }
    req.user = user;
  } catch (err) {
    return next(err);
    // ***************** remove the cookie info from message *************
  }

  next();
});

module.exports = {
  isAuthenticatedUser,
};
