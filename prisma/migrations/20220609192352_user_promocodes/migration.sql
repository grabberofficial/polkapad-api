-- AlterEnum
ALTER TYPE "KycStatusTypes" ADD VALUE 'BLOCKED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "promocode" TEXT;
