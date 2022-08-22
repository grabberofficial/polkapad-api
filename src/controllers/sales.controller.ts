import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { KycStatusTypes, Sale } from '@prisma/client';
import {
  BalancesService,
  SalesService,
  SaleWithUsers,
  UsersService
} from 'services';
import { CreateSaleDto, RegisterOnSaleDto } from 'dto/sales';
import { UserContext } from 'decorators';
import { IUserContext } from 'abstractions/interfaces';
import {
  KycNotAcceptedException,
  WalletsNotAttachedException,
  ZeroBalanceException
} from 'exceptions';
import { WalletName } from 'abstractions/enums';

@Controller('sales')
@ApiTags('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly usersService: UsersService,
    private readonly balancesService: BalancesService
  ) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  createSale(@Body() { title }: CreateSaleDto): Promise<Sale> {
    return this.salesService.create({ title });
  }

  @Post('register')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  async registerOnSale(
    @UserContext() userContext: IUserContext,
    @Body() { saleId }: RegisterOnSaleDto
  ): Promise<SaleWithUsers> {
    const user = await this.usersService.getUserWithWalletsById(userContext.id);
    if (user.wallets.length < [WalletName.ETH, WalletName.POLKA].length)
      throw new WalletsNotAttachedException();

    const balances = await this.balancesService.getByUser(user);
    if (balances.ethBalance == 0 && balances.polkaBalance == 0)
      throw new ZeroBalanceException();

    if (user.kycStatus !== KycStatusTypes.ACCEPTED)
      throw new KycNotAcceptedException();

    return this.salesService.registerUserOnSale(userContext.id, saleId);
  }
}
