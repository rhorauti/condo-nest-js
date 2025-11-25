import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  birthDate?: Date;

  @IsBoolean()
  @IsNotEmpty()
  agreedWithTerms: boolean;
}

export class SignUpResponseDTO {
  @IsNotEmpty()
  @IsString()
  idUser: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsNotEmpty()
  accessLevel: number;

  @IsBoolean()
  @IsNotEmpty()
  agreedWithTerms: boolean;
}
