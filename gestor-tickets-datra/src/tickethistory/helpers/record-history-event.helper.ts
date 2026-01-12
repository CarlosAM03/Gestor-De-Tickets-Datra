import { Injectable } from '@nestjs/common';
import { TicketHistoryService } from '../ticket-history.service';
import { serializeMetadata } from './serialize-metadata';
import { RecordHistoryEventParams } from '../types/record-history-event.type';
import { TicketHistoryBaseMetadata } from '../../ticket/dto/history';

@Injectable()
export class RecordHistoryEventHelper {
  constructor(private readonly ticketHistoryService: TicketHistoryService) {}

  async record<TMetadata extends TicketHistoryBaseMetadata>(
    params: RecordHistoryEventParams<TMetadata>,
  ): Promise<void> {
    const {
      ticketId,
      eventType,
      fromStatus,
      toStatus,
      performedById,
      metadata,
    } = params;

    await this.ticketHistoryService.create({
      ticket: {
        connect: { id: ticketId },
      },
      eventType,
      fromStatus,
      toStatus,
      performedBy: performedById
        ? { connect: { id: performedById } }
        : undefined,
      metadata: serializeMetadata(metadata),
    });
  }
}
