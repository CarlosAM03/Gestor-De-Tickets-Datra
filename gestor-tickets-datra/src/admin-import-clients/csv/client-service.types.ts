import { ServiceContractName } from '@prisma/client';

/**
 * Representa UNA FILA del CSV oficial:
 * clients_service_contracts.csv
 *
 * Regla:
 * - 1 fila = 1 ServiceContract
 * - Un mismo clientRfc puede repetirse
 */
export interface ClientServiceRow {
  // =========================
  // CLIENT
  // =========================
  clientRfc: string; // Client.rfc (PK)
  clientNumber: string; // Client.clientNumber (UNIQUE)

  companyName?: string;
  businessName?: string;
  location?: string;

  clientActive: boolean;

  // =========================
  // SERVICE CONTRACT
  // =========================
  serviceName: ServiceContractName; // enum Prisma
  priorityLevel: number; // >= 1
  slaHours: number; // > 0
  serviceActive: boolean;
}
