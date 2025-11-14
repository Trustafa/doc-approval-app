/*
  Warnings:

  - You are about to drop the column `dislabled` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dislabled",
ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT true;
