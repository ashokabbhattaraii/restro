import { Router } from 'express';
import multer from 'multer';
import { uploadImage, removeImage } from '../controllers/upload.controller';
import { requireAdmin } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', requireAdmin, upload.single('file'), uploadImage);
router.delete('/', requireAdmin, removeImage);

export default router;
