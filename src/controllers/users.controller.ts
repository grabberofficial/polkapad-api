import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { UserContext } from 'decorators';
import { JwtAuthGuard } from 'guards';

import { UserModel } from 'models';

@Controller('users')
@ApiTags('users')
export class UsersController {
  @Get('/currentUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserModel })
  getCurrentUser(@UserContext() user) {
    return user;
  }
}
