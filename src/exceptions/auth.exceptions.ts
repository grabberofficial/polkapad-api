import { HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from 'abstractions/enums';
import BaseException from 'exceptions/base.exception';

export class UnauthorizedException extends BaseException {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      ExceptionTypeEnum.Unauthorized,
      'Unauthorized'
    );
  }
}

export class AuthorizedException extends BaseException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      ExceptionTypeEnum.Authorized,
      'For execution of the request it is necessary to be unauthorized'
    );
  }
}

export class AccessDeniedException extends BaseException {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,
      ExceptionTypeEnum.AccessDenied,
      'Access denied'
    );
  }
}

export class EmailAlreadyUsedException extends BaseException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      ExceptionTypeEnum.EmailAlreadyUsed,
      'Email already used'
    );
  }
}

export class IncorrectEmailOrPasswordException extends BaseException {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      ExceptionTypeEnum.IncorrectEmailOrPassword,
      'Incorrect email or password'
    );
  }
}

export class IncorrectEmailOrCodeException extends BaseException {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      ExceptionTypeEnum.IncorrectEmailOrCode,
      'Incorrect email or code'
    );
  }
}
