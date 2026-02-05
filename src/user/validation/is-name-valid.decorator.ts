import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsNameValidConstraint } from './is-name-valid.constraint';

export function IsNameValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNameValidConstraint,
    });
  };
}
