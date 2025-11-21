-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signatureFileId" UUID;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_signatureFileId_fkey" FOREIGN KEY ("signatureFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
