import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary //
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    /// File has been successfully uploaded ///
    // console.log(
    //   "File has been uploaded successfully on cloudinary",
    //   response.url
    // );
    // console.log(response);
    fs.unlinkSync(localFilePath);
    return response;
    //   This below will remove the locally saved temporary file as the upload operation failed
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
