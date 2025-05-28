const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dydksbxkx",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  try {
    const filePath = file.path;
    const mimetype = file.mimetype;

    let resource_type = "auto";
    if (
      mimetype === "application/pdf" ||
      mimetype === "application/msword" ||
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      resource_type = "raw";
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type,
      use_filename: true,
      unique_filename: false,
    });

    // For PDF force download
    if (mimetype === "application/pdf") {
      return result.secure_url + "?fl_attachment=true";
    }

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
