import { RewardActionTypes } from '@prisma/client';

export const REWARDS_PRIZES = {
  [RewardActionTypes.REGISTRATION]: 0,
  [RewardActionTypes.BINANCE_WALLET]: 5,
  [RewardActionTypes.POLKADOT_WALLET]: 10,
  [RewardActionTypes.KYC_ACCEPTED]: 15,
  [RewardActionTypes.SURVEY_COMPLETED]: 10,
  [RewardActionTypes.TWITTER_FOLLOW]: 2,
  [RewardActionTypes.TELEGRAM_FOLLOW]: 4,
  [RewardActionTypes.BLOG_FOLLOW]: 4
};
