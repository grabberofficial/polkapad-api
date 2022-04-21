-- CreateEnum
CREATE TYPE "CodeTypes" AS ENUM ('SIGNIN', 'RESTORE_PASSWORD');

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "type" "CodeTypes" NOT NULL DEFAULT E'SIGNIN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;
