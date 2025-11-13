import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/mongo-client';

@Injectable()
export class MongoService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(MongoService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ MongoDB Connected Successfully');
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
