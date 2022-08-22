import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BalancesService, UserWithBalances } from 'services';

@Controller('balances')
@ApiTags('balances')
export class BalancesController {
  constructor(private readonly balanceService: BalancesService) {}

  @Get('sale/:saleId')
  @ApiOkResponse()
  getRegisteredOnSaleBalances(
    @Param('saleId') saleId: string
  ): Promise<UserWithBalances[]> {
    return this.balanceService.getRegisteredOnSaleBalances(saleId);
  }
}
