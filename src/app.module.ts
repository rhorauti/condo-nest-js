import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import 'dotenv/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondoModule } from './condo/condo.module';
import { RequestLoggerMiddleware } from './core/middleware/logger.middleware';
import { PostsModule } from './posts/posts.module';
import { JwtAuthGuard } from './user/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PostsModule,
    CondoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
