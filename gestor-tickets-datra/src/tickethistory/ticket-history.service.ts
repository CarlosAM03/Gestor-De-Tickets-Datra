import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TicketHistoryCreateInput): Promise<void> {
    await this.prisma.ticketHistory.create({ data });
  }

  async findByTicket(ticketId: number) {
    return this.prisma.ticketHistory.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        eventType: true,
        fromStatus: true,
        toStatus: true,
        performedById: true,
        metadata: true,
        createdAt: true,
      },
    });
  }
}
