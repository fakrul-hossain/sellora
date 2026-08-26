import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.post('/image', asyncHandler(UploadController.uploadImage));

export const uploadRoutes = router;
