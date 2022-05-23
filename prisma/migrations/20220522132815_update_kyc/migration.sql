/*
  Warnings:

  - The values [VERIFIED] on the enum `KycStatusTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KycStatusTypes_new" AS ENUM ('NOT_VERIFIED', 'IN_PROGRESS', 'ACCEPTED', 'DECLINED');
ALTER TABLE "User" ALTER COLUMN "kycStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "kycStatus" TYPE "KycStatusTypes_new" USING ("kycStatus"::text::"KycStatusTypes_new");
ALTER TYPE "KycStatusTypes" RENAME TO "KycStatusTypes_old";
ALTER TYPE "KycStatusTypes_new" RENAME TO "KycStatusTypes";
DROP TYPE "KycStatusTypes_old";
ALTER TABLE "User" ALTER COLUMN "kycStatus" SET DEFAULT 'NOT_VERIFIED';
COMMIT;
