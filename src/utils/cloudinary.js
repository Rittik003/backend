import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
// console.log(Object.keys(process.env));
// cloudinary.config({ 
//     cloud_name: 'duzcgrody', 
//     api_key: '113213469981189', 
//     api_secret: 'vTzGPvH4D6l5BvFV35i2jaq-RYA' 
//   });

// console.log("Environment Variables:");
// console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
// console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// console.log("Cloudinary Config:", cloudinary.config());

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
//   });
  

// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("Cloudinary Config:", cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // console.log(process.env.PORT);
        // console.log("111111111111111")
        if (!localFilePath) return null
        // console.log("12222222")
        // console.log("API Key:", process.env.CLOUDINARY_API_KEY);
        // console.log("Cloudinary Config:", cloudinary.config());
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log("hek")
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("In error part");
        console.log(error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}
