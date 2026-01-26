import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrUpdatePostLike {
  @IsNumber()
  @IsOptional()
  idPostLike?: number;

  @IsNotEmpty()
  @IsNumber()
  idPost: number;

  @IsNotEmpty()
  @IsNumber()
  idUser: number;
}
