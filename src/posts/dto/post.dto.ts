import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { POST_TYPE } from '../../core/enum/post.enum';
import { CreatePostMedia } from './postMedia.dto';

export class CreateOrUpdatePostDto {
  @IsNumber()
  @IsOptional()
  idPost: number;

  @IsNotEmpty()
  @IsNumber()
  idUser: number;

  @IsEnum(POST_TYPE, {
    message: 'Tipo de post não corresponde as opções definidas.',
  })
  @IsNotEmpty()
  postType: POST_TYPE;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMedia)
  @IsOptional()
  mediaList?: CreatePostMedia[];
}
