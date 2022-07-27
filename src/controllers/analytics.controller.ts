import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { IUserContext } from 'abstractions/interfaces';

import { UsersService, AnalyticsService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';
import { NotFoundException } from 'exceptions';
import { SendAnalyticsEventDto } from 'dto/analytics';

@UseGuards(AuthGuard)
@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly analyticsService: AnalyticsService
  ) {}

  @Post()
  @ApiOkResponse()
  async sendEvent(
    @UserContext() userContext: IUserContext,
    @Body() { type }: SendAnalyticsEventDto
  ) {
    const user = await this.usersService.getUserById(userContext.id);

    if (!user) throw new NotFoundException('UserById', userContext.id);

    await this.analyticsService.sendEvent(user, type);
  }
}
