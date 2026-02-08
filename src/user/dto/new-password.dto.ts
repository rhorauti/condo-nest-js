import { OmitType } from '@nestjs/mapped-types';
import { LoginDTO } from './login.dto';

export class ChangePasswordDTO extends OmitType(LoginDTO, ['email']) {}
