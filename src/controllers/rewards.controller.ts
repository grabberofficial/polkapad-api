import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { IUserContext } from 'abstractions/interfaces';

import { RewardsService } from 'services';
import { UserContext } from 'decorators';
import { AuthGuard } from 'guards';

import { RewardModel } from 'models';

@UseGuards(AuthGuard)
@Controller('rewards')
@ApiTags('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [RewardModel] })
  getRewards(@UserContext() userContext: IUserContext) {
    return this.rewardsService.getRewardsByUserId(userContext.id);
  }
}
