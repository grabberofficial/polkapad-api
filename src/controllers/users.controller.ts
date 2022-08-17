import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IUserContext } from 'abstractions/interfaces';

import { UsersService, WalletsService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';

import { UserContextModel } from 'models';
import { UnauthorizedException } from 'exceptions';

@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService
  ) {}

  @Get('/currentUser')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserContextModel })
  async getCurrentUser(@UserContext() userContext: IUserContext) {
    const user = await this.usersService.getUserById(userContext.id);

    if (!user) throw new UnauthorizedException();

    const wallets = await this.walletsService.getWalletsByUserById(user.id);

    return {
      id: user.id,
      name: user.name,
      kycStatus: user.kycStatus,
      wallets
    } as UserContextModel;
  }

  @Get('sale/:saleId')
  @ApiOkResponse()
  async getRegisteredUsers(@Param('saleId') saleId: string): Promise<User[]> {
    return await this.usersService.getRegisteredOnSaleUsers(saleId);
  }
}
