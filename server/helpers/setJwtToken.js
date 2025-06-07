exports.sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    httpOnly: true, // Means this cookie will accessible by only http requests
    secure: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: user,
    token,
  });
};
