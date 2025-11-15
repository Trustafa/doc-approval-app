/*
  Warnings:

  - The `decision` column on the `Approval` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- AlterTable
ALTER TABLE "Approval" DROP COLUMN "decision",
ADD COLUMN     "decision" "ApprovalDecision" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "DECISION_STATUS";
