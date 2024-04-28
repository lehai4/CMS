/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  applyDecorators,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadDto } from 'src/models/product/dto/file-upload.dto';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

export const fileConfig = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = 'storage/';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};

/** Add all file upload decorators at once
 *
 * <br>Example: Upload product picture
 */
export function FileUpload(): <TFunction>(
  target: object | TFunction,
  propertyKey?: string | symbol,
) => void {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file', fileConfig)),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: FileUploadDto }),
  );
}
