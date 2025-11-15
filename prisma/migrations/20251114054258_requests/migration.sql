/*
  Warnings:

  - You are about to drop the column `name` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[approvalFileId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeInBytes` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approvalFileDate` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approvalFileId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_requestId_fkey";

-- AlterTable
ALTER TABLE "Approval" ADD COLUMN     "decisionAt" TIMESTAMPTZ,
ADD COLUMN     "rejectionReason" TEXT;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "name",
DROP COLUMN "requestId",
DROP COLUMN "url",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "sizeInBytes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "date",
ADD COLUMN     "approvalFileDate" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "approvalFileId" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "externalRef" TEXT,
ADD COLUMN     "internalRef" TEXT,
ADD COLUMN     "processedAt" TIMESTAMPTZ,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RequestFile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,
    "requestId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "RequestFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Request_approvalFileId_key" ON "Request"("approvalFileId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_approvalFileId_fkey" FOREIGN KEY ("approvalFileId") REFERENCES "RequestFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFile" ADD CONSTRAINT "RequestFile_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFile" ADD CONSTRAINT "RequestFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
