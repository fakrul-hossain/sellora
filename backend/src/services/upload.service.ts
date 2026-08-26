import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/app-error.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'g7c5btrc',
  api_key: process.env.CLOUDINARY_API_KEY || '538831226726259',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'J_tks59JfgMKsN2_tl8nXTFZRsg',
  secure: true,
});

export class UploadService {
  public static async uploadImage(base64OrUrl: string, folder: string = 'sellora') {
    try {
      const result = await cloudinary.uploader.upload(base64OrUrl, {
        folder: `sellora/${folder}`,
        resource_type: 'auto',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      throw AppError.badRequest(`Cloudinary upload failed: ${err.message || 'Unknown error'}`);
    }
  }
}
