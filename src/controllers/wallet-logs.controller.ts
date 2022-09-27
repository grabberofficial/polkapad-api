import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { IUserContext } from 'abstractions/interfaces';

import { WalletLogsService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';

import { WalletLogModel } from 'models';
import { CreateWalletLogDto } from 'dto/wallet-logs';

@UseGuards(AuthGuard)
@Controller('wallet-logs')
@ApiTags('wallet-logs')
export class WalletLogsController {
  constructor(private readonly walletLogsService: WalletLogsService) {}

  @Post()
  @ApiOkResponse({ type: WalletLogModel })
  async createWalletLog(
    @UserContext() userContext: IUserContext,
    @Body() { name, network, address }: CreateWalletLogDto
  ) {
    await this.walletLogsService.createWalletLog({
      name,
      network,
      address,
      userId: userContext.id
    });
  }
}
