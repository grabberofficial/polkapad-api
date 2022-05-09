import { ValidationError } from 'class-validator';
import { ExceptionTypeEnum } from 'abstractions/enums';

export interface IException {
  code: number;
  type: ExceptionTypeEnum;
  message: string;

  metadata?: Record<string, string>;
  validationErrors?: ValidationError[];
}
