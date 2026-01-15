import type { TicketEventType, TicketStatus } from '../enums';
import type {
  TicketHistoryMetadataDTO,
} from './ticket-history.dto';

/* =============================
   USER REDUCIDO (UI)
============================= */
export interface TicketHistoryUser {
  id: number;
  name: string;
  email: string;
}

/* =============================
   HISTORY UI MODEL
============================= */
export interface TicketHistory {
  id: number;

  ticketId: number;

  eventType: TicketEventType;

  fromStatus: TicketStatus | null;
  toStatus: TicketStatus | null;

  performedById: number | null;
  performedBy: TicketHistoryUser | null;

  metadata: TicketHistoryMetadataDTO | null;

  createdAt: string;
}
