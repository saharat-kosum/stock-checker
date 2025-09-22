-- DropIndex
DROP INDEX "StockCount_materialId_key";

-- CreateIndex
CREATE INDEX "StockCount_materialId_idx" ON "StockCount"("materialId");
