import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { ERROR_MESSAGE_KEY } from '../decorators/error-message.decorator';

interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private reflector: Reflector) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const handler = (host as unknown as ExecutionContext).getHandler?.();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const customMessage = handler
      ? this.reflector.get<string>(ERROR_MESSAGE_KEY, handler)
      : undefined;

    let defaultMessage: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        defaultMessage = (exceptionResponse as HttpExceptionResponse).message;
      } else if (typeof exceptionResponse === 'string') {
        defaultMessage = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      defaultMessage = exception.message;
    }

    if (Array.isArray(defaultMessage)) {
      defaultMessage = defaultMessage.join(', ');
    }

    let finalMessage: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        finalMessage = (exceptionResponse as HttpExceptionResponse).message;
      } else if (typeof exceptionResponse === 'string') {
        finalMessage = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `[Internal Error]: ${exception.message}`,
        exception.stack,
      );

      finalMessage = customMessage || 'An internal server error occurred';
    }

    if (Array.isArray(finalMessage)) {
      finalMessage = finalMessage.join(', ');
    }

    this.logger.error(
      `HTTP Status: ${status} | Error: ${finalMessage}`,
      `${request.method} ${request.url}`,
    );

    response.status(status).json({
      status: false,
      date: new Date().toISOString(),
      message: finalMessage,
    });
  }
}
