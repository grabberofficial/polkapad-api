import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { KycStatusTypes, UserRoleTypes, Sale } from '@prisma/client';
import {
  BalancesService,
  SalesService,
  SaleWithUsers,
  UsersService
} from 'services';
import { CreateOrUpdateSaleDto, RegisterOnSaleDto } from 'dto/sales';
import { AvailableForRole, UserContext } from 'decorators';
import { IUserContext } from 'abstractions/interfaces';
import {
  KycNotAcceptedException,
  WalletsNotAttachedException,
  ZeroBalanceException
} from 'exceptions';
import { WalletName } from 'abstractions/enums';
import { SaleModel, SalesListModel } from 'models';
import { AuthGuard } from 'guards';
import { ListQueryDto } from 'dto/shared';

@Controller('sales')
@ApiTags('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly usersService: UsersService,
    private readonly balancesService: BalancesService
  ) {}

  @Get('/:id')
  @ApiOkResponse({ type: SaleModel })
  getSaleById(@Param('id') id: string): Promise<SaleModel> {
    return this.salesService.getSaleById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found sales list',
    type: SalesListModel
  })
  async getSalesList(
    @Query()
    { search, offset, count }: ListQueryDto
  ): Promise<SalesListModel> {
    const [data, total] = await this.salesService.getSalesList(
      search,
      offset,
      count
    );

    return {
      data,
      total
    };
  }

  @Post('/create')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
  @AvailableForRole(UserRoleTypes.ADMIN)
  createSale(
    @Body()
    { roadmap, teamMembers, info, tokenInfo, ...sale }: CreateOrUpdateSaleDto
  ): Promise<Sale> {
    return this.salesService.createSale({
      ...sale,
      roadmap: {
        create: roadmap
      },
      teamMembers: {
        create: teamMembers
      },
      info: {
        create: info
      },
      tokenInfo: {
        create: tokenInfo
      }
    });
  }

  @Post('/update/:id')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
  @AvailableForRole(UserRoleTypes.ADMIN)
  updateSale(
    @Param('id') id: string,
    @Body()
    { roadmap, teamMembers, info, tokenInfo, ...sale }: CreateOrUpdateSaleDto
  ): Promise<Sale> {
    return this.salesService.updateSaleById(id, {
      ...sale,
      roadmap: {
        create: roadmap
      },
      teamMembers: {
        create: teamMembers
      },
      info: {
        create: info
      },
      tokenInfo: {
        create: tokenInfo
      }
    });
  }

  @Post('/register')
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
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
