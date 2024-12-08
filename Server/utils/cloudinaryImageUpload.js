import { v2 as cloudinary } from "cloudinary";

//configration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryImageUpload = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
  //upload image
  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "Shopme" }, (error, uploadResult) => {
        return resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadImage;
};

export default cloudinaryImageUpload;

// import { v2 as cloudinary } from "cloudinary";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const cloudinaryImageUpload = async (image) => {
//   if (!image?.buffer) {
//     throw new Error("Invalid image: Buffer is required for upload.");
//   }

//   const buffer = image.buffer;

//   try {
//     // Wrap upload_stream in a Promise for better error handling
//     const uploadImage = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { folder: "Shopme" },
//         (error, uploadResult) => {
//           if (error) return reject(error); // Reject on error
//           resolve(uploadResult); // Resolve with upload result
//         }
//       );

//       uploadStream.end(buffer); // End the stream with the buffer
//     });

//     return uploadImage;
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error);
//     throw new Error(error.message || "Image upload failed.");
//   }
// };

// export default cloudinaryImageUpload;
