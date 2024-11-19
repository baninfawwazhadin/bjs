import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    private readonly customResponse: {
      status: boolean;
      message: string;
      data?: any;
    },
    statusCode: HttpStatus,
  ) {
    super(customResponse, statusCode);
  }

  getResponse() {
    return this.customResponse;
  }
}
