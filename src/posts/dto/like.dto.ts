import { IsNumber, IsString } from 'class-validator';

export class CreateOrRemoveLike {
  @IsNumber()
  userId: number;

  @IsString()
  description: string;
}
