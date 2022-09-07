import { ApiProperty } from '@nestjs/swagger';
import { Reward, RewardActionTypes, RewardSourceTypes } from '@prisma/client';

export class RewardModel implements Reward {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: RewardSourceTypes })
  source: RewardSourceTypes;

  @ApiProperty({ enum: RewardActionTypes })
  action: RewardActionTypes;

  @ApiProperty()
  prize: number;

  @ApiProperty()
  createdAt: Date;
}
