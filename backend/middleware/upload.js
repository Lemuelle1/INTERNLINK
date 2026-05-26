const fs = require('fs');
const path = require('path');
const multer = require('multer');

let storage;

const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('../config/cloudinary');
    storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'internlink',
        allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
      },
    });
    console.log('Multer configured with Cloudinary storage.');
  } catch (err) {
    console.error('Error loading Cloudinary storage, falling back to local storage:', err);
    storage = null;
  }
}

if (!storage) {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  console.log('Multer configured with local disk storage.');
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;
