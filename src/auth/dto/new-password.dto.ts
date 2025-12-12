import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordResponseDTO {
  @Expose()
  idUser: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
