import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../../config/cloudinary.config.js';
import { IStorageProvider, UploadFileResult } from './storage.provider.js';
import { logger } from '../utils/logger.js';

export class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    if (cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret) {
      cloudinary.config({
        cloud_name: cloudinaryConfig.cloudName,
        api_key: cloudinaryConfig.apiKey,
        api_secret: cloudinaryConfig.apiSecret,
      });
    }
  }

  public async uploadFile(fileBuffer: Buffer, fileName: string, folder: string = 'sellora'): Promise<UploadFileResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            logger.error('Cloudinary upload failure:', error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            sizeBytes: result.bytes,
            format: result.format || 'unknown',
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  public async deleteFile(publicId: string): Promise<boolean> {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    } catch (error) {
      logger.error('Cloudinary delete file failure:', error);
      return false;
    }
  }
}
