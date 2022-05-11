import { HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from 'abstractions/enums';
import BaseException from 'exceptions/base.exception';

export class NotFoundException extends BaseException {
  constructor(
    entityName = 'entity',
    entityIdentifier?: string | number,
    message?: string
  ) {
    super(
      HttpStatus.NOT_FOUND,
      ExceptionTypeEnum.NotFound,
      message || `Not found ${entityName}`,
      { entityName, entityIdentifier }
    );
  }
}

export class BadRequestException extends BaseException {
  constructor(message?: string) {
    super(HttpStatus.BAD_REQUEST, ExceptionTypeEnum.BadRequest, message);
  }
}

export class ValidationException extends BaseException {
  constructor(validationErrors: Record<string, string[]>, message?: string) {
    super(
      HttpStatus.BAD_REQUEST,
      ExceptionTypeEnum.ValidationError,
      message,
      undefined,
      validationErrors
    );
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(message?: string) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ExceptionTypeEnum.InternalServerError,
      message
    );
  }
}
