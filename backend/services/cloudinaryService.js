import cloudinary from "../libs/cloudinary.js";

export const uploadImageToCloudinary = async (image, folder) => {
  const result = await cloudinary.uploader.upload(Image, { folder });

  return result;
};
