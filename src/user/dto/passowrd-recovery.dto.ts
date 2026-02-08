import { OmitType } from '@nestjs/mapped-types';
import { LoginDTO } from './login.dto';

export class SendRecoveryEmailDTO extends OmitType(LoginDTO, ['password']) {}
