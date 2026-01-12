import { TicketHistoryBaseMetadata } from './ticket-history-base.metadata';

export class TicketClosedMetadataDto extends TicketHistoryBaseMetadata {
  serviceStatus?: string | null;
  closedAt: string;

  constructor(data: { serviceStatus?: string; closedAt: string }) {
    super();
    this.serviceStatus = data.serviceStatus ?? null;
    this.closedAt = data.closedAt;
  }
}
