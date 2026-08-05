export interface UploadFileResult {
  url: string;
  publicId: string;
  sizeBytes: number;
  format: string;
}

export interface IStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, folder?: string): Promise<UploadFileResult>;
  deleteFile(publicId: string): Promise<boolean>;
}
