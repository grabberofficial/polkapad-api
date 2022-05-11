import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from 'exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const { userContext = undefined } =
      context.switchToHttp().getRequest() || {};

    const isAuthorized = Boolean(userContext);

    if (!isAuthorized) throw new UnauthorizedException();

    return isAuthorized;
  }
}
