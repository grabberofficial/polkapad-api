import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MagicCodesService } from 'services';

@Injectable()
export class MagicCodesWorker {
  constructor(private readonly magicCodesService: MagicCodesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async deleteOutdatedCodes() {
    await this.magicCodesService.deleteOutdatedCodes();
  }
}
