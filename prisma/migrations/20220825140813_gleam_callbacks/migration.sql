-- CreateTable
CREATE TABLE "GleamCallback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "campaignKey" TEXT NOT NULL,
    "campaignType" TEXT NOT NULL,
    "entryMethodId" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "city" TEXT,
    "countryCode" TEXT,
    "socialProvider" TEXT,
    "socialReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GleamCallback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GleamCallback" ADD CONSTRAINT "GleamCallback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
