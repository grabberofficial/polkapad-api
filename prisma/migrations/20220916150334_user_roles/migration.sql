-- CreateEnum
CREATE TYPE "UserRoleTypes" AS ENUM ('ADMIN', 'OWNER', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoleTypes" NOT NULL DEFAULT 'USER';
