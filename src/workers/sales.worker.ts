import { SaleStatusTypes } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SalesService } from 'services';

@Injectable()
export class SalesWorker {
  constructor(private readonly salesService: SalesService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshStatus() {
    const sales = await this.salesService.getAllSalesByStatus(
      SaleStatusTypes.CREATED
    );

    for (const sale of sales) {
      if (sale.startAt) {
        // TODO make logic
      }
    }
  }
}
