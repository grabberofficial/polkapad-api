import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { OtpService } from 'src/auth/otp/otp.service';

@Injectable()
export class TasksService {

  constructor(private readonly otpService: OtpService) { }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async deleteOutdatedCodes() {
    await this.otpService.deleteOutdatedCodes();
  }
}