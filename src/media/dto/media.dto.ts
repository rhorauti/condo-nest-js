import { IsNumber, IsString } from 'class-validator';

export class MediaDTO {
  @IsNumber()
  idMedia!: number;

  @IsString()
  mediaUrl!: string;
}
