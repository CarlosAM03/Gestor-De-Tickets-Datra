import { IsIn } from 'class-validator';
import * as ticketStatusType from './ticket-status.type';

export class StatusUpdateTicketDto {
  @IsIn(ticketStatusType.TICKET_STATUSES)
  status: ticketStatusType.TicketStatus = 'OPEN';
}
