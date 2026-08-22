import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file?: Express.Multer.File,
    @Body('image') base64Image?: string,
  ) {
    if (file) {
      const res = await this.cloudinaryService.uploadFile(file);
      return { url: res.secure_url, public_id: res.public_id };
    } else if (base64Image) {
      const res = await this.cloudinaryService.uploadBase64(base64Image);
      return { url: res.secure_url, public_id: res.public_id };
    }
    throw new BadRequestException('No image file or base64 data provided');
  }
}
