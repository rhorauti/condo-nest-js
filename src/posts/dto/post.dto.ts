import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { POST_TYPE } from '../../core/enum/post.enum';

export class CreateOrUpdatePostDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsEnum(POST_TYPE, {
    message: 'Tipo de post não corresponde as opções definidas.',
  })
  @IsNotEmpty()
  type: POST_TYPE;

  @IsString()
  @IsNotEmpty()
  profileFallback: string;

  @IsString()
  @IsOptional()
  profileUrl?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  mediaList?: string[];

  @IsBoolean()
  @IsNotEmpty()
  isSaved: boolean;

  @IsNumber()
  @IsNotEmpty()
  userId: number; // ID from Postgres User
}
