-- CreateTable
CREATE TABLE "UsersOnSales" (
    "userId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,

    CONSTRAINT "UsersOnSales_pkey" PRIMARY KEY ("userId","saleId")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersOnSales" ADD CONSTRAINT "UsersOnSales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnSales" ADD CONSTRAINT "UsersOnSales_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
