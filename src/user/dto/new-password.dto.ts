import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class ChangePasswordDTO {
  @IsString({ message: 'Formato de senha inválida.' })
  @IsNotEmpty({ message: 'O campo de senha não pode estar vazio.' })
  @Min(8, { message: 'O campo de senha deve ter no mínimo 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'A senha deve conter ao menos 1 letra maiúscula, 1 número e 1 símbolo.',
  })
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
