export enum ExceptionTypeEnum {
  InternalServerError = 'InternalServerError',
  ValidationError = 'ValidationError',
  DatabaseError = 'DatabaseError',
  Unauthorized = 'Unauthorized',
  Authorized = 'Authorized',
  AccessDenied = 'AccessDenied',
  IncorrectEmailOrPassword = 'IncorrectEmailOrPassword',
  IncorrectEmailOrCode = 'IncorrectEmailOrCode',
  EmailAlreadyUsed = 'EmailAlreadyUsed',
  WalletAlreadyUsed = 'WalletAlreadyUsed',
  KycAlreadyAccepted = 'KycAlreadyAccepted',
  KycBlocked = 'KycBlocked',
  NotFound = 'NotFound',
  BadRequest = 'BadRequest',
  Conflict = 'Conflict'
}
