import {
  BadRequestException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export function UsePostFilesUpload(
  primaryFieldName: string = 'files',
  altFieldName: string = 'file',
) {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(primaryFieldName, 5, {
        limits: {
          fileSize: 10 * 1024 * 1024, // 10 MB por arquivo
        },
        fileFilter: (req, file, cb) => {
          // aceita tanto 'files' quanto 'file'
          const field = file.fieldname;
          const isAllowedField =
            field === primaryFieldName || field === altFieldName;

          if (!isAllowedField) {
            return cb(
              new BadRequestException(
                `Campo de arquivo inválido. Use '${primaryFieldName}' ou '${altFieldName}'.`,
              ),
              false,
            );
          }

          if (!file.mimetype.startsWith('image/')) {
            return cb(
              new BadRequestException(
                'Apenas arquivos de imagem são permitidos',
              ),
              false,
            );
          }

          cb(null, true);
        },
      }),
    ),
  );
}
