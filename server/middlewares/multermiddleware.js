const multer = require("multer");
const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

exports.profilePicUpload = multerUpload.single("profilePicture");
