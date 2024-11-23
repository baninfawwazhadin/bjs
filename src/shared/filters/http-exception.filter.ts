import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CustomHttpException } from '../exceptions/custom-http.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any = {
      status: false,
      message: `${exception.message}` || 'Internal server error',
      data: null,
    };

    if (exception instanceof CustomHttpException) {
      responseBody = exception.getResponse();
    }

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as
        | string
        | { message: string | string[]; error: string };

      if (typeof response === 'object' && response.message) {
        responseBody = {
          status: false,
          message: 'Validation failed',
          data: this.formatValidationErrors(response.message),
        };
      }
    }

    response.status(status).json(responseBody);
  }

  private formatValidationErrors(errors: string | string[]): string[] {
    if (Array.isArray(errors)) {
      return errors;
    }
    return [errors];
  }
}
