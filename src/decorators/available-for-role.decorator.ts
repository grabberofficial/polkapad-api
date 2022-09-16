import { UserRoleTypes } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';

export const AvailableForRole = (...roles: UserRoleTypes[]) =>
  SetMetadata('availableForRole', roles);
