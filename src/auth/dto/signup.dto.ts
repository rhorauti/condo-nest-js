import { Expose } from 'class-transformer';
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
  @Expose()
  idUser: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  birthDate: Date;

  @Expose()
  accessLevel: number;

  @Expose()
  agreedWithTerms: boolean;
}
