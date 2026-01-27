import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/postgres/prisma.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { JwtAuthService } from './jwt-auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    JwtAuthService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UserService, JwtAuthService],
})
export class UserModule {}
