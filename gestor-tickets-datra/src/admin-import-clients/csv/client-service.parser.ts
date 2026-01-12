import { parse } from 'csv-parse/sync';
import { ClientServiceRow } from './client-service.types';
import { ServiceContractName } from '@prisma/client';

export interface ParsedClientServiceRow {
  rowNumber: number;
  data: ClientServiceRow;
}

interface RawClientServiceCsvRow {
  clientRfc?: string;
  clientNumber?: string;
  companyName?: string;
  businessName?: string;
  location?: string;
  clientActive?: string | number | boolean;

  serviceName?: string;
  priorityLevel?: string | number;
  slaHours?: string | number;
  serviceActive?: string | number | boolean;
}

export class ClientServiceCsvParser {
  /**
   * CSV → objetos tipados
   * ❌ NO valida dominio
   */
  static parse(csvContent: string | Buffer): ParsedClientServiceRow[] {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as unknown as RawClientServiceCsvRow[];

    const result: ParsedClientServiceRow[] = [];

    records.forEach((record, index) => {
      const rowNumber = index + 2; // header + base 0

      try {
        const row: ClientServiceRow = {
          // =========================
          // CLIENT
          // =========================
          clientRfc: this.requiredString(record.clientRfc, 'clientRfc'),

          clientNumber: this.requiredString(
            record.clientNumber,
            'clientNumber',
          ),

          companyName: this.optionalString(record.companyName),

          businessName: this.optionalString(record.businessName),

          location: this.optionalString(record.location),

          clientActive: this.parseBoolean(record.clientActive, true),

          // =========================
          // SERVICE CONTRACT
          // =========================
          serviceName: this.requiredString(
            record.serviceName,
            'serviceName',
          ) as ServiceContractName,

          priorityLevel: this.parseInt(record.priorityLevel, 'priorityLevel'),

          slaHours: this.parseInt(record.slaHours, 'slaHours'),

          serviceActive: this.parseBoolean(record.serviceActive, true),
        };

        result.push({ rowNumber, data: row });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Row ${rowNumber}: ${error.message}`);
        }
        throw error;
      }
    });

    return result;
  }

  // ======================================================
  // HELPERS (STRICT + SAFE)
  // ======================================================

  private static requiredString(value: unknown, field: string): string {
    if (typeof value !== 'string') {
      throw new Error(`Missing required field '${field}'`);
    }

    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error(`Empty field '${field}'`);
    }

    return trimmed;
  }

  private static optionalString(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }

  private static parseInt(value: unknown, field: string): number {
    const num = typeof value === 'number' ? value : Number(value);

    if (!Number.isInteger(num)) {
      throw new Error(`Field '${field}' must be an integer`);
    }

    return num;
  }

  private static parseBoolean(value: unknown, defaultValue: boolean): boolean {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1') return true;
      if (normalized === 'false' || normalized === '0') return false;
    }

    throw new Error(`Invalid boolean value '${typeof value}'`);
  }
}
