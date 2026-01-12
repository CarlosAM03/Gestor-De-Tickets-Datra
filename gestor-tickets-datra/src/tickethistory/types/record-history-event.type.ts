import { TicketEventType, TicketStatus } from '@prisma/client';
import { TicketHistoryBaseMetadata } from '../../ticket/dto/history';

export interface RecordHistoryEventParams<
  TMetadata extends TicketHistoryBaseMetadata,
> {
  ticketId: number;
  eventType: TicketEventType;

  fromStatus?: TicketStatus | null;
  toStatus?: TicketStatus | null;

  performedById?: number | null;

  metadata?: TMetadata;
}
