import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './common/email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, EmailModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthModule],
})
export class AppModule {}
