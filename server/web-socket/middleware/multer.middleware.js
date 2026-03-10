import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/media',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const  upload = multer({
  storage,
  limits: { files: 10, fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mov|avi/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) return cb(null, true);
    cb(new Error("Only pictures or videos are allowed!"));
  }
}).array('media', 10);

export default upload