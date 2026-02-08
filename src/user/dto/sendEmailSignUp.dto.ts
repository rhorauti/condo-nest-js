import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLES } from '../../core/enum/role.enum';
import { IsNameValid } from '../validation/user-name/is-name-valid.decorator';

export class SendEmailSignUpDTO {
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  @IsNotEmpty({ message: 'O campo de e-mail não pode estar vazio.' })
  email!: string;

  @IsNameValid()
  name!: string;

  @IsString({ message: 'O campo Role é obrigatório.' })
  role!: USER_ROLES;
}
