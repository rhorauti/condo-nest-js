import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  @IsString({ message: 'Formato inválido.' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/, {
    message:
      'Informe pelo menos nome e sobrenome, e o primeiro nome deve ter no mínimo 2 letras.',
  })
  name: string;

  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O campo de e-mail não pode estar vazio.' })
  email: string;

  @IsString({ message: 'Formato de senha inválida.' })
  @IsNotEmpty({ message: 'O campo de senha não pode estar vazio.' })
  @Min(8, { message: 'O campo de senha deve ter no mínimo 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'A senha deve conter ao menos 1 letra maiúscula, 1 número e 1 símbolo.',
  })
  password: string;

  @IsDateString({}, { message: 'Formato de data inválido.' })
  @IsNotEmpty({ message: 'O campo data de nascimento não pode estar vazio.' })
  birthDate?: Date;

  @IsBoolean({ message: 'Formato do campo de aceite dos termos inválido.' })
  @IsNotEmpty({
    message: 'O campo aceite dos termos não pode estar sem a flag.',
  })
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
  agreedWithTerms: boolean;
}

export class AdminSignUpDTO {}
