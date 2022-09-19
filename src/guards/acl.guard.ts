import { isEmpty, includes } from 'lodash';
import { UserRoleTypes } from '@prisma/client';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessDeniedException } from 'exceptions';

@Injectable()
export class ACLGuard implements CanActivate {
  private reflector: Reflector;

  constructor(reflector: Reflector) {
    this.reflector = reflector;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const contextHandler = context.getHandler();

    const roles: UserRoleTypes[] = this.reflector.get(
      'availableForRole',
      contextHandler
    );

    let hasAccess = false;

    const { authContext = undefined } =
      context.switchToHttp().getRequest() || {};

    if (authContext && authContext.role) {
      hasAccess = !isEmpty(roles) ? includes(roles, authContext.role) : true;
    }

    if (!hasAccess) throw new AccessDeniedException();

    return hasAccess;
  }
}
