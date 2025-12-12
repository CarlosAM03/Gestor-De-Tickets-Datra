import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTicketDto, userId: number) {
    // 1. Crear ticket sin código
    const ticket = await this.prisma.ticket.create({
      data: {
        ...data,
        createdById: userId,
        openedAt: data.openedAt ? new Date(data.openedAt) : new Date(),
        estimatedStart: data.estimatedStart
          ? new Date(data.estimatedStart)
          : undefined,
        closedAt: data.closedAt ? new Date(data.closedAt) : undefined,
        code: 'TEMP', // requerido momentáneamente
      },
    });

    // 2. generar código tipo T-0001
    const formattedCode = `TT-${ticket.id.toString().padStart(6, '0')}`;

    // 3. actualizar ticket con el code real
    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { code: formattedCode },
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        createdBy: true,
        preliminaryBy: true,
        closingTechnician: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: true,
        preliminaryBy: true,
        closingTechnician: true,
      },
    });
  }

  async update(id: number, data: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...data,
        estimatedStart: data.estimatedStart
          ? new Date(data.estimatedStart)
          : undefined,
        closedAt: data.closedAt ? new Date(data.closedAt) : undefined,
      },
    });
  }

  async remove(id: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no existe`);
    }

    await this.prisma.ticket.delete({ where: { id } });

    return { message: `Ticket ${id} eliminado correctamente` };
  }
}
