import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

@Module({})
export class CSurfMiddleware implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer
      .apply(
        csurf({
          cookie: {
            key: '_csrf',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
          },
        }),
      )
      .forRoutes('*');
  }
}
