/*
  Warnings:

  - You are about to drop the column `create_ts` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `modify_ts` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `Material` table. All the data in the column will be lost.
  - Added the required column `bringForward` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modifyDate` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockCount` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "create_ts",
DROP COLUMN "description",
DROP COLUMN "modify_ts",
DROP COLUMN "quality",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bringForward" INTEGER NOT NULL,
ADD COLUMN     "code" INTEGER NOT NULL,
ADD COLUMN     "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifyDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "note" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sloc" INTEGER NOT NULL DEFAULT 6101,
ADD COLUMN     "stockCount" INTEGER NOT NULL,
ADD COLUMN     "stockIn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockOut" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'EA';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "refreshToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
