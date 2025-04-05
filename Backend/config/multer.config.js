// config/multer.config.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure 'uploads/' directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save in uploads directory
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

// File filter (optional: to restrict uploads to images only)
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer upload instances
export const uploadSingle = multer({ storage, fileFilter }).single('avatar');
// 👈 use 'avatar' here
     // for 1 file
export const uploadMultiple = multer({ storage, fileFilter }).array('images', 5);  // for up to 5 files
