import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePostMedia } from './postMedia.dto';

export class CreateOrUpdateCommentDto {
  @IsNumber()
  @IsOptional()
  idComment: number;

  @IsNotEmpty()
  @IsNumber()
  idUser: number;

  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  idPost: number;

  @IsNumber()
  @IsOptional()
  idParent?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMedia)
  @IsOptional()
  mediaList?: CreatePostMedia[];
}
