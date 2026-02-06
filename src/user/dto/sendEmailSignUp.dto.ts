import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsNameValid } from '../validation/is-name-valid.decorator';

export class SendEmailSignUpDTO {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O campo de e-mail não pode estar vazio.' })
  email!: string;

  @IsNameValid()
  name!: string;
}
