-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'tecnico',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL,
    "requestedBy" TEXT,
    "contact" TEXT,
    "clientType" TEXT,
    "serviceAffected" TEXT,
    "problemDesc" TEXT,
    "eventLocation" TEXT,
    "estimatedStart" TIMESTAMP(3),
    "impactLevel" TEXT,
    "preliminaryBy" TEXT,
    "initialFindings" TEXT,
    "probableRootCause" TEXT,
    "actionsTaken" TEXT,
    "closedAt" TIMESTAMP(3),
    "serviceStatus" TEXT,
    "closingTechnician" TEXT,
    "additionalNotes" TEXT,
    "correctiveAction" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_code_key" ON "Ticket"("code");
