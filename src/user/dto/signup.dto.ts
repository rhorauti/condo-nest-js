import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';
import { USER_ROLES } from '../../core/enum/role.enum';
import { IsAgeValid } from '../validation/user-birthday/is-birthday-valid.decorator';
import { LoginDTO } from './login.dto';

export class SignUpDTO extends LoginDTO {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  @IsString({ message: 'Formato inválido.' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/, {
    message:
      'Informe pelo menos nome e sobrenome, e o primeiro nome deve ter no mínimo 2 letras e não pode conter números.',
  })
  name!: string;

  @IsAgeValid()
  birthDate!: Date;

  @IsBoolean({ message: 'Formato do campo de aceite dos termos inválido.' })
  @IsNotEmpty({
    message: 'O campo aceite dos termos não pode estar sem a flag.',
  })
  agreedWithTerms!: boolean;

  @IsString({ message: 'Deve ser fornecida a role' })
  role!: USER_ROLES;
}
