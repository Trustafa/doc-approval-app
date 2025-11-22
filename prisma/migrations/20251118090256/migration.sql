/*
  Warnings:

  - A unique constraint covering the columns `[signedApprovalFileId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "signedApprovalFileId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Request_signedApprovalFileId_key" ON "Request"("signedApprovalFileId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_signedApprovalFileId_fkey" FOREIGN KEY ("signedApprovalFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
