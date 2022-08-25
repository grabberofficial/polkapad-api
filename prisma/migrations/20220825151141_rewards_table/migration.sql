-- CreateEnum
CREATE TYPE "RewardSourceTypes" AS ENUM ('INNER', 'GLEAM', 'KYC');

-- CreateEnum
CREATE TYPE "RewardActionTypes" AS ENUM ('REGISTRATION', 'BINANCE_WALLET', 'POLKADOT_WALLET', 'KYC_ACCEPTED', 'SURVEY_COMPLETED', 'TWITTER_FOLLOW', 'TELEGRAM_FOLLOW', 'BLOG_FOLLOW');

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" "RewardSourceTypes" NOT NULL,
    "action" "RewardActionTypes" NOT NULL,
    "prize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
