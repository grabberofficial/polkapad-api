-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "description" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "startAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "RoadmapForSale" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapForSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMemberForSale" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "TeamMemberForSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleInfoForSale" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "tgeType" TEXT NOT NULL,
    "vesting" TEXT NOT NULL,
    "parachain" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "SaleInfoForSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenInfoForSale" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "raise" INTEGER NOT NULL,

    CONSTRAINT "TokenInfoForSale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleInfoForSale_saleId_key" ON "SaleInfoForSale"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenInfoForSale_saleId_key" ON "TokenInfoForSale"("saleId");

-- AddForeignKey
ALTER TABLE "RoadmapForSale" ADD CONSTRAINT "RoadmapForSale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMemberForSale" ADD CONSTRAINT "TeamMemberForSale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleInfoForSale" ADD CONSTRAINT "SaleInfoForSale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInfoForSale" ADD CONSTRAINT "TokenInfoForSale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
