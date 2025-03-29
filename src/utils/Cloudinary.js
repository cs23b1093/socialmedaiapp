import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET   
});

const uploadonCloudinary = async (localfilePath) => {
    if(!localfilePath) return null
    try {
        const fileUpload = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto",
            unique_filename: true,
            overwrite: false
        })
        console.log("file is uploaded successfully!", fileUpload.url)
        return fileUpload
    } catch (error) {
        fs.unlinkSync(localfilePath)
        console.log("Error uploading file to cloudinary", error);
    }
}

export  default uploadonCloudinary;