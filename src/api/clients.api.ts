import type { TicketClient } from '@/types/ticket.types';

/*
  Implementación mínima.
  Mañana se conecta directo al backend real.
*/

export async function searchClients(
  query: string,
): Promise<TicketClient[]> {
  if (!query) return [];

  // 🔧 Placeholder temporal
  return [];
}
