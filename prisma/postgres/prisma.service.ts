import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/postgres-client';
import 'dotenv/config';

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.POSTGRES_URL,
    });
    super({ adapter });
  }
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Postgres Connected Successfully');
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
