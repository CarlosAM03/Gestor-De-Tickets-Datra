-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "actionsTaken" TEXT,
ADD COLUMN     "additionalNotes" TEXT,
ADD COLUMN     "contactInfo" TEXT,
ADD COLUMN     "correctiveAction" BOOLEAN,
ADD COLUMN     "estimatedStart" TIMESTAMP(3),
ADD COLUMN     "initialFindings" TEXT,
ADD COLUMN     "probableRootCause" TEXT,
ADD COLUMN     "requestedBy" TEXT,
ADD COLUMN     "serviceStatus" TEXT;
