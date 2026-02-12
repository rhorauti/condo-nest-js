import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import 'dotenv/config';
import { PrismaModule } from '../prisma/postgres/prisma.module';
import { SupabaseModule } from '../superbase/superbase.module';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondoModule } from './condo/condo.module';
import { PostsModule } from './posts/posts.module';
import { SupabaseAuthGuard } from './user/guards/supabase-auth.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    UserModule,
    PrismaModule,
    AddressModule,
    PostsModule,
    CondoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
})
export class AppModule {}
