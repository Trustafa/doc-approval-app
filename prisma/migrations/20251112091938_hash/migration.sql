/*
  Warnings:

  - You are about to drop the column `supplier` on the `Request` table. All the data in the column will be lost.
  - Added the required column `payee` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "supplier",
ADD COLUMN     "payee" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedPassword" TEXT NOT NULL;
