import { TicketHistoryBaseMetadata } from './ticket-history-base.metadata';

export class TicketCreatedMetadataDto extends TicketHistoryBaseMetadata {
  requestedBy?: string | null;
  contactInfo?: string | null;
  initialFindings?: string | null;
  probableRootCause?: string | null;

  constructor(data: {
    requestedBy?: string;
    contactInfo?: string;
    initialFindings?: string;
    probableRootCause?: string;
  }) {
    super();
    this.requestedBy = data.requestedBy ?? null;
    this.contactInfo = data.contactInfo ?? null;
    this.initialFindings = data.initialFindings ?? null;
    this.probableRootCause = data.probableRootCause ?? null;
  }
}
