import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';

import { UserContextModel } from 'models';

@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('users')
export class UsersController {
  @Get('/currentUser')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserContextModel })
  getCurrentUser(@UserContext() userContext) {
    return userContext;
  }
}
