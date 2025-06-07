const cloudinary = require("cloudinary").v2;
const { v4: uuid } = require("uuid");
const { getBase64 } = require("../helpers/helper.js");

const uploadFilesToCloudinary = async function (files) {
  files = files || [];

  const uploadPromises = files.map(function (file) {
    return new Promise(function (resolve, reject) {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        function (error, result) {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map(function (result) {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });

    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary: " + err.message);
  }
};

const deletFilesFromCloudinary = async function (public_id) {
  await cloudinary.uploader.destroy(public_id);
};

module.exports = {
  uploadFilesToCloudinary,
  deletFilesFromCloudinary,
};
