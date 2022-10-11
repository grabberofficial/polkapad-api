import { KycStatusTypes, UserRoleTypes } from '@prisma/client';

export interface IUserContext {
  id: string;
  name?: string;
  kycStatus?: KycStatusTypes;
  role?: UserRoleTypes;
}
