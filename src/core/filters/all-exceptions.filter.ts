import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/postgres-client';
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

    const customMessage = handler
      ? this.reflector.get<string>(ERROR_MESSAGE_KEY, handler)
      : undefined;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let finalMessage: string | string[] = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

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
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.warn(
        `Prisma Error [${exception.code}]: ${exception.message}`,
      );

      switch (exception.code) {
        case 'P2002': // Unique constraint violation (e.g., duplicate email)
          status = HttpStatus.CONFLICT; // 409
          finalMessage = 'Registro duplicado.'; // Função auxiliar para extrair o campo
          break;

        case 'P2025': // Record to update/delete/find unique not found
          status = HttpStatus.NOT_FOUND; // 404
          finalMessage = 'Registro não encontrado.';
          break;

        default:
          // Deixa como 500 para outros erros de DB não mapeados
          finalMessage = 'A database operation failed unexpectedly.';
          break;
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

    console.log('Mensagem de erro: ' + finalMessage);

    response.status(status).json({
      status: false,
      date: new Date().toISOString(),
      message: finalMessage,
    });
  }
}
