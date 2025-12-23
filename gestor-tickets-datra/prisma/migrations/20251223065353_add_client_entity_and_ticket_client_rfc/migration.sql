-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "clientRfc" TEXT;

-- AlterTable
ALTER TABLE "TicketHistory" ADD COLUMN     "clientRfc" TEXT;

-- CreateTable
CREATE TABLE "Client" (
    "rfc" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessName" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("rfc")
);

-- CreateIndex
CREATE INDEX "TicketHistory_ticketId_idx" ON "TicketHistory"("ticketId");

-- CreateIndex
CREATE INDEX "TicketHistory_clientRfc_idx" ON "TicketHistory"("clientRfc");

-- CreateIndex
CREATE INDEX "TicketHistory_createdAt_idx" ON "TicketHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clientRfc_fkey" FOREIGN KEY ("clientRfc") REFERENCES "Client"("rfc") ON DELETE SET NULL ON UPDATE CASCADE;
