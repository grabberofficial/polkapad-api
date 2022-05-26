import { HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from 'abstractions/enums';
import BaseException from 'exceptions/base.exception';

export class WalletAlreadyUsedException extends BaseException {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      ExceptionTypeEnum.WalletAlreadyUsed,
      'Wallet already used'
    );
  }
}
