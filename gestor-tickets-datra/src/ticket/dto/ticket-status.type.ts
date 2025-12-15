export const TICKET_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'ON_HOLD',
  'RESOLVED',
  'CLOSED',
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
