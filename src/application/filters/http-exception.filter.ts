import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Response } from 'express';
import { formatHttpException } from 'utils/exceptions';
import BaseException from 'exceptions/base.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const resultException = formatHttpException({
      code: exception.getStatus(),
      ...exception
    });

    response.status(resultException.code).json(resultException);
  }
}
