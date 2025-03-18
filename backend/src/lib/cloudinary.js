import { v2 as cloudinary } from "cloudinary";
// dotenv 用于加载环境变量。它可以从项目根目录下的.env文件中读取键值对，并将它们添加到Node.js的process.env对象中
import { config } from 'dotenv';

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary;

// cloudinary 用来上查传图片