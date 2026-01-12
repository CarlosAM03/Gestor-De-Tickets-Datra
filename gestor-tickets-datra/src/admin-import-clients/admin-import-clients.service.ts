import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientServiceRow } from './csv/client-service.types';

export interface AdminImportClientsResult {
  clientsUpserted: number;
  serviceContractsUpserted: number;
}

@Injectable()
export class AdminImportClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async importValidatedRows(
    rows: ClientServiceRow[],
  ): Promise<AdminImportClientsResult> {
    // =========================
    // Group by client RFC
    // =========================
    const rowsByClient = new Map<string, ClientServiceRow[]>();

    for (const row of rows) {
      if (!rowsByClient.has(row.clientRfc)) {
        rowsByClient.set(row.clientRfc, []);
      }
      rowsByClient.get(row.clientRfc)!.push(row);
    }

    let clientsUpserted = 0;
    let serviceContractsUpserted = 0;

    // =========================
    // Transaction
    // =========================
    await this.prisma.$transaction(async (tx) => {
      for (const [clientRfc, clientRows] of rowsByClient.entries()) {
        const base = clientRows[0];

        // -------------------------
        // UPSERT CLIENT
        // -------------------------
        await tx.client.upsert({
          where: { rfc: clientRfc },
          create: {
            rfc: clientRfc,
            clientNumber: base.clientNumber,
            companyName: base.companyName,
            businessName: base.businessName,
            location: base.location,
            active: base.clientActive,
          },
          update: {
            clientNumber: base.clientNumber,
            companyName: base.companyName,
            businessName: base.businessName,
            location: base.location,
            active: base.clientActive,
          },
        });

        clientsUpserted++;

        // -------------------------
        // SERVICE CONTRACTS
        // -------------------------
        for (const row of clientRows) {
          const existing = await tx.serviceContract.findFirst({
            where: {
              clientRfc,
              name: row.serviceName,
            },
          });

          if (existing) {
            await tx.serviceContract.update({
              where: { id: existing.id },
              data: {
                priorityLevel: row.priorityLevel,
                slaHours: row.slaHours,
                active: row.serviceActive,
              },
            });
          } else {
            await tx.serviceContract.create({
              data: {
                name: row.serviceName,
                priorityLevel: row.priorityLevel,
                slaHours: row.slaHours,
                active: row.serviceActive,
                clientRfc,
              },
            });
          }

          serviceContractsUpserted++;
        }
      }
    });

    return {
      clientsUpserted,
      serviceContractsUpserted,
    };
  }
}
