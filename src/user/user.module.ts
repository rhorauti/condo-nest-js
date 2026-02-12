import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/postgres/prisma.service';
import { SupabaseModule } from '../../superbase/superbase.module';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [PassportModule, SupabaseModule, EmailModule],
  controllers: [UserController, AuthController],
  providers: [UserService, PrismaService, EmailService],
  exports: [UserService],
})
export class UserModule {}
