import multer, { FileFilterCallback } from "multer";
import path from "path";
import { CustomError } from "../middlewares/error.middleware";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new CustomError('Only image files are allowed', 400), false);
  }
};

const multerUpload = multer({
  storage, fileFilter: (fileFilter as any),
  limits: { fileSize: 2 * 1024 * 1024 }
});

export default multerUpload
