/*
  Warnings:

  - The `clientType` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `impactLevel` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECNICO', 'INGENIERO');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('INTERNO', 'EXTERNO');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "deleteRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" INTEGER,
ALTER COLUMN "openedAt" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "clientType",
ADD COLUMN     "clientType" "ClientType",
DROP COLUMN "impactLevel",
ADD COLUMN     "impactLevel" "ImpactLevel";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'TECNICO';

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
