import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IUserContext } from 'abstractions/interfaces';

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
  async getCurrentUser(@UserContext() userContext: IUserContext) {
    const user = await this.usersService.getUserById(userContext.id);

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      kycStatus: user.kycStatus,
      role: user.role
    } as UserContextModel;
  }

  @Get('sale/:saleId')
  @ApiOkResponse()
  getRegisteredUsers(@Param('saleId') saleId: string): Promise<User[]> {
    return this.usersService.getRegisteredOnSaleUsers(saleId);
  }
}
