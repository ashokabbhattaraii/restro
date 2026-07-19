import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'izsiyvaa',
  api_key: process.env.CLOUDINARY_API_KEY || '232259679477431',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'UDrMIAKKwwAEhj2omGWAGJw_meM',
  secure: true,
});

export default cloudinary;