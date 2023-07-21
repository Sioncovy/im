import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Req,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async UploadedFile(@UploadedFiles() files) {}
}
