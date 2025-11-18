/*
  Warnings:

  - A unique constraint covering the columns `[idNumber]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "idNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Request_idNumber_key" ON "Request"("idNumber");
