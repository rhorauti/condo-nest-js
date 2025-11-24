import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const throwNestError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        throw new ConflictException('Registro já existente.');
      }
      case 'P2025': {
        throw new NotFoundException('Registro não encontrado.');
      }
      case 'P2000': {
        throw new BadRequestException(
          'Registro possui mais caracteres do que o permitido.',
        );
      }
      case 'P2003': {
        throw new BadRequestException(
          'Falha na tentativa de criar o registro devido a não existencia de uma chave estrageira.',
        );
      }
      case 'P2004': {
        throw new BadRequestException(
          'A tentativa de registro viola a contraint para este campo.',
        );
      }
      case 'P2007': {
        throw new BadRequestException('Erro de validação do tipo da variável');
      }
      case 'P2011': {
        throw new BadRequestException(
          'Não é permitido o registro de valor null para este campo.',
        );
      }
      case 'P2023': {
        throw new BadRequestException(
          'Tipo da variável diferente do campo do banco de dados.',
        );
      }
      default: {
        throw new InternalServerErrorException('Erro interno do servidor 1.');
      }
    }
  } else {
    throw new InternalServerErrorException('Erro interno do servidor 2.');
  }
};
