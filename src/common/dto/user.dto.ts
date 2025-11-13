import { IsInt } from 'class-validator';

export class CreateUserDTO {
  @IsInt()
  idUser?: number;
  email: string;
  password: string;
  agreedWithTerms: boolean;
}
