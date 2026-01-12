import { ServiceContractName } from '@prisma/client';
import { ParsedClientServiceRow } from './client-service.parser';
import { ClientServiceRow } from './client-service.types';

export interface ClientServiceValidationError {
  row: number;
  reason: string;
}

export interface ClientServiceValidationResult {
  validRows: ClientServiceRow[];
  errors: ClientServiceValidationError[];
}

export class ClientServiceValidator {
  static validate(
    rows: ParsedClientServiceRow[],
  ): ClientServiceValidationResult {
    const errors: ClientServiceValidationError[] = [];
    const validRows: ClientServiceRow[] = [];

    // =========================
    // Cross-row trackers
    // =========================
    const clientNumberByRfc = new Map<string, string>();
    const serviceKeySet = new Set<string>();

    for (const { rowNumber, data } of rows) {
      try {
        // -------------------------
        // RFC
        // -------------------------
        this.validateRfc(data.clientRfc);

        // -------------------------
        // clientNumber conflicts
        // -------------------------
        const existingClientNumber = clientNumberByRfc.get(data.clientRfc);

        if (!existingClientNumber) {
          clientNumberByRfc.set(data.clientRfc, data.clientNumber);
        } else if (existingClientNumber !== data.clientNumber) {
          throw new Error(`clientNumber conflict for RFC ${data.clientRfc}`);
        }

        // -------------------------
        // Service duplicate in CSV
        // -------------------------
        const serviceKey = `${data.clientRfc}::${data.serviceName}`;

        if (serviceKeySet.has(serviceKey)) {
          throw new Error(
            `Duplicate service '${data.serviceName}' for RFC ${data.clientRfc}`,
          );
        }

        serviceKeySet.add(serviceKey);

        // -------------------------
        // Enum validation
        // -------------------------
        this.validateServiceName(data.serviceName);

        // -------------------------
        // Priority
        // -------------------------
        if (data.priorityLevel < 1) {
          throw new Error('priorityLevel must be >= 1');
        }

        // -------------------------
        // SLA
        // -------------------------
        if (data.slaHours <= 0) {
          throw new Error('slaHours must be > 0');
        }

        // -------------------------
        // OK
        // -------------------------
        validRows.push(data);
      } catch (error) {
        errors.push({
          row: rowNumber,
          reason: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
        });
      }
    }

    return { validRows, errors };
  }

  // ======================================================
  // DOMAIN HELPERS
  // ======================================================

  private static validateRfc(rfc: string) {
    const normalized = rfc.trim().toUpperCase();

    if (normalized.length < 12 || normalized.length > 13) {
      throw new Error('RFC must be 12 or 13 characters');
    }
  }

  private static validateServiceName(serviceName: string): void {
    const allowed = Object.values(ServiceContractName);

    if (!allowed.includes(serviceName as ServiceContractName)) {
      throw new Error(`serviceName INVALID_ENUM (${serviceName})`);
    }
  }
}
