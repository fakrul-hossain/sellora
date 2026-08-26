import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service.js';
import { ApiResponseBuilder } from '../utils/api-response.js';

export class UploadController {
  public static uploadImage = async (req: Request, res: Response) => {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image base64 payload or URL is required' });
    }

    const uploaded = await UploadService.uploadImage(image, folder || 'general');
    return ApiResponseBuilder.success(res, 'Image uploaded to Cloudinary successfully', uploaded);
  };
}
