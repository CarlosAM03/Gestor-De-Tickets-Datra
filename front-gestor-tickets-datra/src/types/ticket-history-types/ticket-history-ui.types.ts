import type { TicketEventType, TicketStatus } from '../enums';
import type { User } from '../user.types';

export interface TicketHistory {
  id: number;

  ticketId: number;

  eventType: TicketEventType;

  fromStatus: TicketStatus | null;
  toStatus: TicketStatus | null;

  performedById: number | null;
  performedBy: User | null;

  metadata: Record<string, unknown> | null;

  createdAt: string;
}
