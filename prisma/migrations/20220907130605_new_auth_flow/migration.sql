/*
  Warnings:

  - The values [SIGNIN,RESTORE_PASSWORD] on the enum `MagicCodeTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `MagicCode` table. All the data in the column will be lost.
  - Added the required column `email` to the `MagicCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MagicCodeTypes_new" AS ENUM ('SIGN_IN', 'SIGN_UP');
ALTER TABLE "MagicCode" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "MagicCode" ALTER COLUMN "type" TYPE "MagicCodeTypes_new" USING ("type"::text::"MagicCodeTypes_new");
ALTER TYPE "MagicCodeTypes" RENAME TO "MagicCodeTypes_old";
ALTER TYPE "MagicCodeTypes_new" RENAME TO "MagicCodeTypes";
DROP TYPE "MagicCodeTypes_old";
ALTER TABLE "MagicCode" ALTER COLUMN "type" SET DEFAULT 'SIGN_UP';
COMMIT;

-- DropForeignKey
ALTER TABLE "MagicCode" DROP CONSTRAINT "MagicCode_userId_fkey";

-- AlterTable
ALTER TABLE "MagicCode" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'SIGN_UP';
