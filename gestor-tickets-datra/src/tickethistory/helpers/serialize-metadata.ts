import { Prisma } from '@prisma/client';
import { TicketHistoryBaseMetadata } from '../../ticket/dto/history';

export function serializeMetadata(
  metadata?: TicketHistoryBaseMetadata,
): Prisma.InputJsonValue | undefined {
  if (!metadata) {
    return undefined;
  }

  /**
   * Regla:
   * - SOLO objetos planos
   * - Sin métodos
   * - Sin undefined
   */
  return JSON.parse(JSON.stringify(metadata)) as Prisma.InputJsonValue;
}
