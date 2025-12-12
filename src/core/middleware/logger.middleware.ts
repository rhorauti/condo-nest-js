import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && Object.keys(req.body).length > 0) {
      this.logger.log(`Incoming Body for ${req.method} ${req.originalUrl}:`);
      this.logger.log(JSON.stringify(req.body));
    }
    next();
  }
}
