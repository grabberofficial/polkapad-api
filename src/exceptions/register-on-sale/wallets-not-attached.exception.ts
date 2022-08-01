import BaseException from 'exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from 'abstractions/enums';

export class WalletsNotAttachedException extends BaseException {
  constructor() {
    super(HttpStatus.BAD_REQUEST, ExceptionTypeEnum.WalletsNotAttached, 'WalletsNotAttached');
  }
}

