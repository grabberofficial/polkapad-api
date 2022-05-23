import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { UsersService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';

import { UserContextModel } from 'models';
import { UnauthorizedException } from 'exceptions';

@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/currentUser')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserContextModel })
  async getCurrentUser(@UserContext() userContext: UserContextModel) {
    const user = await this.usersService.getUserById(userContext.id);

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      name: user.name,
      kycStatus: user.kycStatus
    } as UserContextModel;
  }
}
