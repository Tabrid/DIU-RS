import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadSingle = async (req, res, next) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(req.file.path);
    // fs.unlink(req.file.path, (err) => {
    //   if (err) {
    //     console.error("Error deleting file:", err);
    //   } else {
    //     console.log("File deleted successfully");
    //   }
    // });
    // change hare as you need
    const { public_id, url } = uploadResponse;

    req.body.file = url;
    next();
  } catch (error) {
    console.log(error);
  }
};
