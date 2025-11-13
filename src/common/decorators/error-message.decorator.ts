import { SetMetadata } from '@nestjs/common';

export const ERROR_MESSAGE_KEY = 'error_message';
export const ErrorMessage = (message: string) =>
  SetMetadata(ERROR_MESSAGE_KEY, message);
