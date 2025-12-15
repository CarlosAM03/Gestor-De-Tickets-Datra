-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'OPEN';
