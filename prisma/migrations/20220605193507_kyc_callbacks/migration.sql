-- CreateTable
CREATE TABLE "KycCallback" (
    "id" TEXT NOT NULL,
    "kycId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycCallback_pkey" PRIMARY KEY ("id")
);
