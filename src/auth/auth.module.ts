import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PostgresAuthService } from './postgres-auth.service';
import { AuthController } from './auth.controller';
import { PostgresService } from '../../prisma/postgres/postgres.service';
import { MongoService } from '../../prisma/mongodb/mongo.service';
import { EmailService } from '../email/email.service';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2d' },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    PostgresAuthService,
    PostgresService,
    JwtAuthService,
    MongoService,
    EmailService,
  ],
  exports: [PostgresAuthService, JwtAuthService],
})
export class AuthModule {}
