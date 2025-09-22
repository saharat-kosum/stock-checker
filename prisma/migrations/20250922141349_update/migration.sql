/*
  Warnings:

  - Added the required column `countDiff` to the `StockCount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockCount" ADD COLUMN     "countDiff" INTEGER NOT NULL;
