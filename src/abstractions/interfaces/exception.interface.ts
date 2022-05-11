import { HttpStatus } from '@nestjs/common';
import { ExceptionTypeEnum } from 'abstractions/enums';

export interface IException {
  code: HttpStatus;
  type: ExceptionTypeEnum;
  message: string;

  metadata?: Record<string, string>;
  validationErrors?: Record<string, string[]>;
}
