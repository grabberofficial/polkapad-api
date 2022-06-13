/*
  Warnings:

  - Added the required column `userId` to the `KycCallback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KycCallback" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "KycResult" (
    "id" TEXT NOT NULL,
    "kycId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "dateOfBirth" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KycCallback" ADD CONSTRAINT "KycCallback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycResult" ADD CONSTRAINT "KycResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
