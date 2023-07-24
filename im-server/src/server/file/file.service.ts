import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { config } from 'src/config';
import { Express } from 'express';
import qiniu from 'qiniu';

@Injectable()
export class FileService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  uploadFile(file: Express.Multer.File) {
    return {
      code: 200,
      data: {
        url: `${config.host}/${file.filename}`,
      },
      message: 'ok',
    };
  }
}
