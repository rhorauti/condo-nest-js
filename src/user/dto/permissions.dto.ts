import { IsBoolean, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionsDTO {
  @IsNumber({}, { message: 'Formato do campo inválido.' })
  @IsNotEmpty({ message: 'O campo idUser não pode estar vazio.' })
  idUser: number;

  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O campo de e-mail não pode estar vazio.' })
  email: string;

  @IsBoolean({ message: 'O campo deve ser boolean.' })
  isActive: boolean;

  @IsNumber({}, { message: 'O campo deve ser em formato de número.' })
  accessLevel: number;
}
