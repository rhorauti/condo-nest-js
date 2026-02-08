import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsAgeValidConstraint } from './is-birthday-valid.contraint';

export function IsAgeValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAgeValidConstraint,
    });
  };
}
