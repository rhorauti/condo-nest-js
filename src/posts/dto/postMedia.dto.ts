import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostMedia {
  @IsOptional()
  @IsNumber()
  idPostMedia?: number;

  @IsNotEmpty()
  @IsString()
  mediaPath: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsNumber()
  idPost?: number;

  @IsOptional()
  @IsNumber()
  idComment?: number;
}
