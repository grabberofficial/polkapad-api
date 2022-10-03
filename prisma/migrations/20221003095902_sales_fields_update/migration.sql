-- AlterTable
ALTER TABLE "RoadmapForSale" ADD COLUMN     "finishAt" TIMESTAMP(3),
ALTER COLUMN "startAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "finishAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SaleInfoForSale" ALTER COLUMN "tgeType" DROP NOT NULL,
ALTER COLUMN "vesting" DROP NOT NULL,
ALTER COLUMN "parachain" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TeamMemberForSale" ALTER COLUMN "role" DROP NOT NULL;
