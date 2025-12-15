import { IsIn } from 'class-validator';
import * as ticketStatusType from '../types/ticket-status.type';

export class StatusUpdateTicketDto {
  @IsIn(ticketStatusType.TICKET_STATUSES)
  status: ticketStatusType.TicketStatus = 'OPEN';
}
