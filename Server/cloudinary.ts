import { v2 as cloudinary } from 'cloudinary'; 
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export { cloudinary };