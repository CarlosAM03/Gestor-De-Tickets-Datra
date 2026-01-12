export const TICKET_STATUSES = [
  'OPEN',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
