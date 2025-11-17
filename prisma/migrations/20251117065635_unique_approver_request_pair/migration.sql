/*
  Warnings:

  - A unique constraint covering the columns `[approverId,requestId]` on the table `Approval` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Approval_approverId_requestId_key" ON "Approval"("approverId", "requestId");
