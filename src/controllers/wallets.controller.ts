import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Param
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { IUserContext } from 'abstractions/interfaces';

import { WalletsService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';

import { WalletModel } from 'models';
import { NotFoundException, WalletAlreadyUsedException } from 'exceptions';
import { CreateWalletDto } from 'dto/wallets';

@UseGuards(AuthGuard)
@Controller('wallets')
@ApiTags('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [WalletModel] })
  getWallets(@UserContext() userContext: IUserContext) {
    return this.walletsService.getWalletsByUserId(userContext.id);
  }

  @Post()
  @ApiOkResponse({ type: WalletModel })
  async createWallet(
    @UserContext() userContext: IUserContext,
    @Body() { name, value }: CreateWalletDto
  ) {
    const isValueExist = await this.walletsService.getWalletByValue(value);

    if (isValueExist) throw new WalletAlreadyUsedException();

    const isNameExist = await this.walletsService.getWalletByName(
      userContext.id,
      name
    );

    if (isNameExist) throw new WalletAlreadyUsedException();

    return this.walletsService.createWallet({
      name,
      value,
      userId: userContext.id
    });
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteWallet(
    @UserContext() userContext: IUserContext,
    @Param('id') id: string
  ) {
    const wallet = await this.walletsService.getWalletById(id);

    if (!wallet || wallet.userId !== userContext.id)
      throw new NotFoundException(
        'WalletById',
        id,
        `No wallet found by id: ${id}`
      );

    await this.walletsService.deleteWalletById(id);
  }
}
