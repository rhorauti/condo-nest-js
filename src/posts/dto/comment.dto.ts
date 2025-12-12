import { IsNumber, IsString } from 'class-validator';

export class CreateOrUpdateComment {
  @IsNumber()
  userId: number;

  @IsString()
  description: string;
}
