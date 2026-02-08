import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAgeValid', async: false })
export class IsAgeValidConstraint implements ValidatorConstraintInterface {
  validate(birthDate: Date, args: ValidationArguments) {
    if (!birthDate) return false;
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return eighteenYearsAgo.getTime() >= birthDate.getTime();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Idade não autorizada. O usuário deve ter no mínimo 18 anos.';
  }
}
