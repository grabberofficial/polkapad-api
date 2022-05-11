import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IException } from 'abstractions/interfaces';
import { ExceptionTypeEnum } from 'abstractions/enums';

export class HttpExceptionModel implements IException {
  @ApiProperty()
  code: HttpStatus;

  @ApiProperty({ enum: ExceptionTypeEnum })
  type: ExceptionTypeEnum;

  @ApiProperty()
  message: string;

  @ApiProperty()
  metadata?: Record<string, string>;

  @ApiProperty()
  validationErrors?: Record<string, string[]>;
}
