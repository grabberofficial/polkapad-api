-- CreateEnum
CREATE TYPE "SaleStatusTypes" AS ENUM ('CREATED', 'STARTED', 'REGISTRATION', 'PAUSE', 'SALE', 'FINISHED');

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "status" "SaleStatusTypes" NOT NULL DEFAULT 'CREATED';
