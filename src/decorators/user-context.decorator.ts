import { IUserContext } from 'abstractions/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserContext = createParamDecorator(
  (data: any, ctx: ExecutionContext): IUserContext => {
    const request = ctx.switchToHttp().getRequest();

    return request.userContext as IUserContext;
  }
);
