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

// 1. Define a helper interface for the expected response structure
interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private reflector: Reflector) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // FIX 1: Cast 'host' to 'ExecutionContext' to access 'getHandler'
    // We use optional chaining (?.) in case the error happens outside a handler (e.g., middleware)
    const handler = (host as unknown as ExecutionContext).getHandler?.();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Safe retrieval: If handler is undefined (e.g., 404 error), this returns undefined
    const customMessage = handler
      ? this.reflector.get<string>(ERROR_MESSAGE_KEY, handler)
      : undefined;

    // FIX 2: Resolve ESLint Unsafe Assignment by strict type narrowing
    let defaultMessage: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // Strictly check if the response is an object and matches our interface
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        // Cast to our known interface
        defaultMessage = (exceptionResponse as HttpExceptionResponse).message;
      } else if (typeof exceptionResponse === 'string') {
        defaultMessage = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      defaultMessage = exception.message;
    }

    // Flatten array messages (common in validation errors) to a single string
    if (Array.isArray(defaultMessage)) {
      defaultMessage = defaultMessage.join(', ');
    }

    // Final decision
    const finalMessage = customMessage || defaultMessage;

    // FIX 3: Safe stack access
    const stackTrace = exception instanceof Error ? exception.stack : '';

    this.logger.error(
      `HTTP Status: ${status} | Error: ${finalMessage}`,
      stackTrace,
      `${request.method} ${request.url}`,
    );

    response.status(status).json({
      status: false,
      date: new Date().toISOString(),
      message: finalMessage,
      path: request.url,
    });
  }
}
