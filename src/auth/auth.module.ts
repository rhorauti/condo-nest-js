import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongoService } from '../../prisma/mongodb/mongo.service';
import { PostgresService } from '../../prisma/postgres/postgres.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { PostgresAuthService } from './postgres-auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '2d' },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    PostgresAuthService,
    PostgresService,
    JwtAuthService,
    MongoService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [PostgresAuthService, JwtAuthService],
})
export class AuthModule {}
