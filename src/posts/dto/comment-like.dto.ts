import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrUpdateCommentLike {
  @IsNumber()
  @IsOptional()
  idCommentLike?: number;

  @IsNotEmpty()
  @IsNumber()
  idComment: number;

  @IsNotEmpty()
  @IsNumber()
  idUser: number;
}
