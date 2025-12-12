/*
  Warnings:

  - You are about to drop the column `closingTechnician` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `preliminaryBy` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "closingTechnician",
DROP COLUMN "preliminaryBy",
ADD COLUMN     "closingTechnicianId" INTEGER,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "preliminaryById" INTEGER;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_preliminaryById_fkey" FOREIGN KEY ("preliminaryById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_closingTechnicianId_fkey" FOREIGN KEY ("closingTechnicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
