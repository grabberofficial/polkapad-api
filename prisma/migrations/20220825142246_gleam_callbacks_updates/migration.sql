-- DropForeignKey
ALTER TABLE "GleamCallback" DROP CONSTRAINT "GleamCallback_userId_fkey";

-- AlterTable
ALTER TABLE "GleamCallback" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GleamCallback" ADD CONSTRAINT "GleamCallback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
