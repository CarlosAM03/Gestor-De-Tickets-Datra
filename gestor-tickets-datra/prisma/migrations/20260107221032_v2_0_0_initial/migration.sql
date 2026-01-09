-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECNICO', 'INGENIERO');

-- CreateEnum
CREATE TYPE "TicketEventType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'CLOSED', 'CANCELLED', 'UPDATED', 'COMMENT_ADDED', 'IMPORTED_FROM_LIBRENMS');

-- CreateEnum
CREATE TYPE "TicketSource" AS ENUM ('MANUAL', 'LIBRENMS', 'IMPORTED');

-- CreateEnum
CREATE TYPE "ServiceContractName" AS ENUM ('INTERNET_DEDICADO_100_MB', 'INTERNET_DEDICADO_200_MB', 'INTERNET_DEDICADO_500_MB', 'INTERNET_DEDICADO_1_GB', 'INTERNET_DEDICADO_2_GB', 'INTERNET_DEDICADO_4_GB', 'INTERNET_DEDICADO_10_GB', 'INTERNET_COMPARTIDO_100_MB', 'INTERNET_COMPARTIDO_200_MB', 'INTERNET_COMPARTIDO_500_MB', 'INTERNET_COMPARTIDO_1_GB', 'INTERNET_COMPARTIDO_2_GB', 'INTERNET_COMPARTIDO_4_GB', 'INTERNET_COMPARTIDO_10_GB', 'ENLACE_PUNTO_A_PUNTO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TECNICO',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "rfc" TEXT NOT NULL,
    "clientNumber" TEXT NOT NULL,
    "companyName" TEXT,
    "businessName" TEXT,
    "location" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("rfc")
);

-- CreateTable
CREATE TABLE "ServiceContract" (
    "id" SERIAL NOT NULL,
    "name" "ServiceContractName" NOT NULL,
    "priorityLevel" INTEGER NOT NULL,
    "slaHours" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" TIMESTAMP(3),
    "clientRfc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "source" "TicketSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "clientRfc" TEXT NOT NULL,
    "serviceContractId" INTEGER NOT NULL,
    "impactLevel" "ImpactLevel" NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "eventLocation" TEXT,
    "createdById" INTEGER,
    "closedById" INTEGER,
    "cancelledById" INTEGER,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketHistory" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "eventType" "TicketEventType" NOT NULL,
    "fromStatus" "TicketStatus",
    "toStatus" "TicketStatus",
    "performedById" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientNumber_key" ON "Client"("clientNumber");

-- CreateIndex
CREATE INDEX "ServiceContract_name_idx" ON "ServiceContract"("name");

-- CreateIndex
CREATE INDEX "ServiceContract_priorityLevel_idx" ON "ServiceContract"("priorityLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_code_key" ON "Ticket"("code");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_source_idx" ON "Ticket"("source");

-- CreateIndex
CREATE INDEX "Ticket_clientRfc_idx" ON "Ticket"("clientRfc");

-- CreateIndex
CREATE INDEX "Ticket_serviceContractId_idx" ON "Ticket"("serviceContractId");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "TicketHistory_ticketId_idx" ON "TicketHistory"("ticketId");

-- CreateIndex
CREATE INDEX "TicketHistory_eventType_idx" ON "TicketHistory"("eventType");

-- CreateIndex
CREATE INDEX "TicketHistory_createdAt_idx" ON "TicketHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "ServiceContract" ADD CONSTRAINT "ServiceContract_clientRfc_fkey" FOREIGN KEY ("clientRfc") REFERENCES "Client"("rfc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clientRfc_fkey" FOREIGN KEY ("clientRfc") REFERENCES "Client"("rfc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_serviceContractId_fkey" FOREIGN KEY ("serviceContractId") REFERENCES "ServiceContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketHistory" ADD CONSTRAINT "TicketHistory_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketHistory" ADD CONSTRAINT "TicketHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
