import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || 'ecoverse',
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY') || '158527898485395',
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET') || 'aDVH4XA1FXilEce34maDiPIS_Ho',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ecoverse' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new BadRequestException(error.message));
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadBase64(base64Str: string): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(base64Str, {
        folder: 'ecoverse',
      });
      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Base64 image upload failed');
    }
  }
}
