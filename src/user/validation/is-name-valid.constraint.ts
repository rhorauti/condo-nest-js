import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNameValid', async: false })
export class IsNameValidConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (!name) return false;
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) return false;
    if (parts[0].length < 2) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Informe nome e sobrenome, com o primeiro nome tendo pelo menos 2 letras.';
  }
}
