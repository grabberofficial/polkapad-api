import { IException } from 'abstractions/interfaces';
import { ExceptionTypeEnum } from 'abstractions/enums';
import { ValidationError } from 'class-validator';

class BaseException extends Error implements IException {
  public code: number;

  public type: ExceptionTypeEnum;

  public message: string;

  public metadata?: any;

  public validationErrors?: ValidationError[];

  constructor(
    code: number,
    type: ExceptionTypeEnum,
    message: string,
    metadata?: any,
    validationErrors?: ValidationError[]
  ) {
    super(message);

    this.code = code;
    this.type = type;
    this.message = message;
    this.metadata = metadata;
    this.validationErrors = validationErrors;
  }
}

export default BaseException;
