import cloudinary from "../libs/cloudinary.js";
import { serviceErrorHandler } from "../utils/handler.js";

// 原始函数定义
const _uploadImageToCloudinary = async (image, folderName) => {
  const result = await cloudinary.uploader.upload(image, {
    folder: folderName,
  });
  return result;
};

const _deleteImageFromCloudinary = async (image, folderName) => {
  const publicId = image.split("/").pop().split(".")[0];
  const result = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
  return result;
};

// 导出包装后的函数
export const uploadImageToCloudinary = serviceErrorHandler(
  _uploadImageToCloudinary,
  "Cloudinary",
  "Upload Image"
);
export const deleteImageFromCloudinary = serviceErrorHandler(
  _deleteImageFromCloudinary,
  "Cloudinary",
  "Delete Image"
);
