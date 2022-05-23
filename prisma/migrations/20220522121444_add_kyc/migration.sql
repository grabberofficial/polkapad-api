/*
  Warnings:

  - A unique constraint covering the columns `[kycId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "KycStatusTypes" AS ENUM ('NOT_VERIFIED', 'IN_PROGRESS', 'VERIFIED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kycId" TEXT,
ADD COLUMN     "kycStatus" "KycStatusTypes" NOT NULL DEFAULT E'NOT_VERIFIED';

-- CreateIndex
CREATE UNIQUE INDEX "User_kycId_key" ON "User"("kycId");
