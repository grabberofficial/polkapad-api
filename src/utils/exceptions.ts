import { isString } from 'lodash';
import { HttpStatus } from '@nestjs/common';
import { IException } from 'abstractions/interfaces';
import { ExceptionTypeEnum } from 'abstractions/enums';

export const formatHttpException = ({
  code,
  type,
  message,
  metadata,
  validationErrors
}: Partial<IException>): IException => {
  const exception: IException = {
    code: code || HttpStatus.INTERNAL_SERVER_ERROR,
    type: type || ExceptionTypeEnum.InternalServerError,
    message: message || 'Internal server error'
  };

  if (!type && code) {
    if (isString(code)) {
      exception.code = HttpStatus.INTERNAL_SERVER_ERROR;
      exception.type = ExceptionTypeEnum.DatabaseError;
      exception.metadata = { code };
    } else if (code === HttpStatus.CONFLICT) {
      exception.type = ExceptionTypeEnum.Conflict;
    } else if (code === HttpStatus.BAD_REQUEST) {
      exception.type = ExceptionTypeEnum.BadRequest;
    } else if (code === HttpStatus.NOT_FOUND) {
      exception.type = ExceptionTypeEnum.NotFound;
    }
  }

  if (metadata) {
    exception.metadata = metadata;
  }

  if (validationErrors) {
    exception.code = HttpStatus.BAD_REQUEST;
    exception.type = ExceptionTypeEnum.ValidationError;
    exception.validationErrors = validationErrors;
  }

  return exception;
};
