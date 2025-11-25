import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRecoveryDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
