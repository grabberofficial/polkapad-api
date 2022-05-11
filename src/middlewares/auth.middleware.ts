import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from 'services';
import { Request, Response } from 'express';
import { UserContextModel } from 'models';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  async use(
    req: Request & { userContext: UserContextModel },
    res: Response,
    next: () => any
  ): Promise<any> {
    const { authorization: token } = req.headers;

    if (token) {
      try {
        const userContext = await this.jwtService.verifyAsync(token);

        if (userContext) {
          req.userContext = userContext;
        }
      } catch {}
    }

    return next();
  }
}
