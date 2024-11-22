import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    const status =
      this.reflector.get<number>('response_status', context.getHandler()) ||
      response.statusCode;

    const message =
      this.reflector.get<string>('response_message', context.getHandler()) ||
      'Success';

    response.status(status);

    return next.handle().pipe(
      map((data) => ({
        status: true,
        message,
        data,
      })),
    );
  }
}
