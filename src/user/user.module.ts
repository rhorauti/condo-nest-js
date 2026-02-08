import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/postgres/prisma.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { JwtAuthService } from './services/jwt-auth.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';

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
  controllers: [UserController, AuthController],
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
