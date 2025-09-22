-- CreateTable
CREATE TABLE "StockCount" (
    "id" SERIAL NOT NULL,
    "stockCode" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "countedQty" INTEGER NOT NULL,
    "systemQty" INTEGER NOT NULL,
    "countedDate" TIMESTAMP(3) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "StockCount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockCount_stockCode_key" ON "StockCount"("stockCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockCount_materialId_key" ON "StockCount"("materialId");

-- AddForeignKey
ALTER TABLE "StockCount" ADD CONSTRAINT "StockCount_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
