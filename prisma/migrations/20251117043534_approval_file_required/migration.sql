/*
  Warnings:

  - Made the column `approvalFileId` on table `Request` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_approvalFileId_fkey";

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "approvalFileId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_approvalFileId_fkey" FOREIGN KEY ("approvalFileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
