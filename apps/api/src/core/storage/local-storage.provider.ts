import fs from 'fs';
import path from 'path';
import { IStorageProvider, UploadFileResult } from './storage.provider.js';

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async uploadFile(fileBuffer: Buffer, fileName: string, folder: string = 'general'): Promise<UploadFileResult> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const publicId = `${folder}/${Date.now()}-${fileName}`;
    const filePath = path.join(this.uploadDir, publicId);

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      url: `/uploads/${publicId}`,
      publicId,
      sizeBytes: fileBuffer.length,
      format: path.extname(fileName).replace('.', ''),
    };
  }

  public async deleteFile(publicId: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, publicId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
