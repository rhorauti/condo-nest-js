import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // 👈 Import Reflector
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator'; // 👈 Import our key

export interface StandardResponse<T> {
  status: boolean;
  date: string;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  // 1. Inject the Reflector in the constructor
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    // 2. Read the message from our new decorator
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(), // 👈 This gets the controller method
    );

    return next.handle().pipe(
      map((data: T) => ({
        status: true,
        date: new Date().toISOString(),
        // 3. Use the dynamic message, or fallback to the generic one
        message: message || 'Request processed successfully',
        data: data,
      })),
    );
  }
}
