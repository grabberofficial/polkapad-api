/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MagicCodeTypes" AS ENUM ('SIGNIN', 'RESTORE_PASSWORD');

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- DropTable
DROP TABLE "Otp";

-- DropEnum
DROP TYPE "CodeTypes";

-- CreateTable
CREATE TABLE "MagicCode" (
    "id" TEXT NOT NULL,
    "hashedCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "MagicCodeTypes" NOT NULL DEFAULT E'SIGNIN',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MagicCode" ADD CONSTRAINT "MagicCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
