import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class LogValidationPipe implements PipeTransform {
  private readonly logger = new Logger(LogValidationPipe.name);
  private readonly validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  async transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug(
      `Valor recebido no pipe (${metadata.type}): ${JSON.stringify(value)}`,
    );
    this.logger.debug(`Metatype: ${metadata.metatype?.name}`);

    // delega a validação pro ValidationPipe padrão
    return this.validationPipe.transform(value, metadata);
  }
}
