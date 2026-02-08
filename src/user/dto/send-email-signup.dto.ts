import { OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { USER_ROLES } from '../../core/enum/role.enum';
import { SignUpDTO } from './signup.dto';

export class SendEmailSignUpDTO extends OmitType(SignUpDTO, [
  'agreedWithTerms',
  'birthDate',
  'password',
]) {
  @IsString({ message: 'O campo Role é obrigatório.' })
  role!: USER_ROLES;
}
