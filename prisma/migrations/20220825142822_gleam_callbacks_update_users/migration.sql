/*
  Warnings:

  - Made the column `userEmail` on table `GleamCallback` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GleamCallback" ALTER COLUMN "userEmail" SET NOT NULL;
