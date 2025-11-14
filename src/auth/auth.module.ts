import { Module } from '@nestjs/common';
import { PostgresAuthService } from './postgres-auth.service';
import { AuthController } from './auth.controller';
import { PostgresService } from '../../prisma/postgres/postgres.service';
import { MongoService } from '../../prisma/mongodb/mongo.service';

@Module({
  controllers: [AuthController],
  providers: [PostgresAuthService, PostgresService, MongoService],
  exports: [PostgresAuthService],
})
export class AuthModule {}
