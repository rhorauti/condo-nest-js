import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendRecoveryEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
