import http from './http';
import type { TicketHistory } from '@/types/ticket-history-types/ticket-history-ui.types';

export const getTicketHistory = async (
  ticketId: number,
): Promise<TicketHistory[]> => {
  const { data } = await http.get<TicketHistory[]>(
    `/tickets/${ticketId}/history`,
  );
  return data;
};
