import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NewPasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class NewPasswordResponseDTO {
  @IsNotEmpty()
  @IsString()
  idUser: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
