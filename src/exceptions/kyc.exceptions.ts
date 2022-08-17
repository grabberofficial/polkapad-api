import { HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from 'abstractions/enums';
import BaseException from 'exceptions/base.exception';

export class KycAlreadyAcceptedException extends BaseException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      ExceptionTypeEnum.KycAlreadyAccepted,
      'Kyc already accepted'
    );
  }
}

export class KycBlockedException extends BaseException {
  constructor() {
    super(HttpStatus.BAD_REQUEST, ExceptionTypeEnum.KycBlocked, 'Kyc blocked');
  }
}

export class KycNotAcceptedException extends BaseException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      ExceptionTypeEnum.KycNotAccepted,
      'Kyc not accepted'
    );
  }
}
