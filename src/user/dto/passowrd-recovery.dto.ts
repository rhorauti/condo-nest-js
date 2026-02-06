import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendRecoveryEmailDTO {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O campo de e-mail não pode estar vazio.' })
  email!: string;
}
