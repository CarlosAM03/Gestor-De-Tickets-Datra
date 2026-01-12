import { TicketHistoryBaseMetadata } from './ticket-history-base.metadata';

export class TicketUpdatedMetadataDto extends TicketHistoryBaseMetadata {
  eventLocation?: string | null;
  estimatedStart?: string | null;
  initialFindings?: string | null;
  probableRootCause?: string | null;
  actionsTaken?: string | null;
  additionalNotes?: string | null;
  correctiveAction?: boolean | null;

  constructor(data: Partial<TicketUpdatedMetadataDto>) {
    super();
    Object.assign(this, data);
  }
}
