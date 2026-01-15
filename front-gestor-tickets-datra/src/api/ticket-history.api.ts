import http from './http';

import type {
  TicketHistoryResponseDTO,
} from '@/types/ticket-history-types/ticket-history.dto';

import type {
  TicketHistory,
} from '@/types/ticket-history-types/ticket-history-ui.types';

export const getTicketHistory = async (
  ticketId: number,
): Promise<TicketHistory[]> => {
  const { data } = await http.get<TicketHistoryResponseDTO[]>(
    `/tickets/${ticketId}/history`,
  );

  return data.map(mapHistoryDtoToUi);
};

/* =============================
   MAPPER
============================= */
const mapHistoryDtoToUi = (
  dto: TicketHistoryResponseDTO,
): TicketHistory => ({
  id: dto.id,
  ticketId: 0, // backend no lo envía, UI-only
  eventType: dto.eventType,

  fromStatus: dto.fromStatus,
  toStatus: dto.toStatus,

  performedById: dto.performedBy?.id ?? null,
  performedBy: dto.performedBy
    ? {
        id: dto.performedBy.id,
        name: dto.performedBy.name,
        email: dto.performedBy.email,
      }
    : null,

  metadata: dto.metadata,
  createdAt: dto.createdAt,
});
