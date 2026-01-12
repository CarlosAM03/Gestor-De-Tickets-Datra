import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketHistoryService } from './ticket-history.service';
import { RecordHistoryEventHelper } from './helpers/record-history-event.helper';
import { TicketHistoryController } from './ticket-history.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TicketHistoryController],
  providers: [TicketHistoryService, RecordHistoryEventHelper],
  exports: [RecordHistoryEventHelper],
})
export class TicketHistoryModule {}
