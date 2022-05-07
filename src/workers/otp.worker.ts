import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OtpService } from 'services';

@Injectable()
export class OtpWorker {
  constructor(private readonly otpService: OtpService) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async deleteOutdatedCodes() {
    await this.otpService.deleteOutdatedCodes();
  }
}
