import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres-client';

@Injectable()
export class PostgresService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PostgresService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ PostgreSQL Connected Successfully');
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
