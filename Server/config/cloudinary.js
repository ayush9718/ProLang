const cloudinary = require("cloudinary");
require("dotenv").config();

exports.cloudinaryConnect = () => {
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            cloud_key: process.env.API_KEY,
            cloud_secret: process.env.API_SECRET
        });
        console.log("cloudinary connection succesfull");
    }
    catch{
        console.log("cloudinary connection failed");
        
    }
}