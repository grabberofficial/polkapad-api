import { Injectable } from '@nestjs/common';

import { Prisma, Reward } from '@prisma/client';

import { PrismaRepository } from 'repositories';
import { REWARDS_PRIZES } from 'constants/rewards.constants';

@Injectable()
export class RewardsService {
  private readonly rewardsRepository: Prisma.RewardDelegate<Prisma.RejectOnNotFound>;

  constructor(prismaRepository: PrismaRepository) {
    this.rewardsRepository = prismaRepository.reward;
  }

  public createReward(
    info: Omit<Prisma.RewardUncheckedCreateInput, 'prize'>
  ): Promise<Reward> {
    const newReward: Prisma.RewardUncheckedCreateInput = {
      ...info,
      prize: REWARDS_PRIZES[info.action]
    };

    return this.rewardsRepository.create({ data: newReward });
  }

  public getRewardsByUserId(userId: string): Promise<Reward[]> {
    return this.rewardsRepository.findMany({
      where: {
        userId
      }
    });
  }
}
