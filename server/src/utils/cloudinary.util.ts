import cloudinary from "../config/cloudinary";
import fs from "fs";

// Upload an image
const uploadFile = async (filePath: string, folder = 'uploads') => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  // Delete local file after upload
  console.log(filePath)
  fs.unlink(filePath, (err) => {
    if (err)
      throw err;
  });
  return result;
}

const deleteFile = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Delete file result: ', result);
  } catch (err) {
    throw err
  }
}

const FileUtil = {
  uploadFile,
  deleteFile
};
export default FileUtil;
