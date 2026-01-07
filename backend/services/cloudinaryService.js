import cloudinary from "../libs/cloudinary.js";

export const uploadImageToCloudinary = async (image, folder) => {
  const result = await cloudinary.uploader.upload(image, { folder });

  return result;
};

export const deleteImageFromCloudinary = async (image, folder) => {
  const imageId = image.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(`${folder}/${imageId}`);
};
