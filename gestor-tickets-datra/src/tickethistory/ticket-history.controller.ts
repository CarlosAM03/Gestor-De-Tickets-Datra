import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketHistoryService } from './ticket-history.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('tickets/:ticketId/history')
@UseGuards(JwtAuthGuard)
export class TicketHistoryController {
  constructor(
    private readonly ticketHistoryService: TicketHistoryService,
    private readonly prisma: PrismaService,
  ) {}

  // ======================================================
  // GET /tickets/:ticketId/history
  // READ-ONLY — APPEND ONLY
  // ======================================================
  @Get()
  async findByTicket(@Param('ticketId', ParseIntPipe) ticketId: number) {
    const ticketExists = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true },
    });

    if (!ticketExists) {
      throw new NotFoundException('Ticket not found');
    }

    return this.ticketHistoryService.findByTicket(ticketId);
  }
}
export { TicketHistoryService };
