import { HttpException } from '@nestjs/common';
import { IException } from 'abstractions/interfaces';
import { ExceptionTypeEnum } from 'abstractions/enums';

class BaseException extends HttpException implements IException {
  public code: number;

  public type: ExceptionTypeEnum;

  public message: string;

  public metadata?: any;

  public validationErrors?: Record<string, string[]>;

  constructor(
    code: number,
    type: ExceptionTypeEnum,
    message: string,
    metadata?: any,
    validationErrors?: Record<string, string[]>
  ) {
    super(message, code);

    this.code = code;
    this.type = type;
    this.message = message;
    this.metadata = metadata;
    this.validationErrors = validationErrors;
  }
}

export default BaseException;
