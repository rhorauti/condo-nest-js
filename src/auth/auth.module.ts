import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresService } from '../../prisma/postgres/postgres.service';
import { MongoService } from '../../prisma/mongodb/mongo.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PostgresService, MongoService],
  exports: [AuthService],
})
export class AuthModule {}
