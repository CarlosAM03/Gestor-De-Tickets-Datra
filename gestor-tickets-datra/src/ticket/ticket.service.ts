import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Prisma } from '@prisma/client';
import { TicketStatus } from './dto/ticket-status.type';

interface FindTicketsParams {
  userId: number;
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  impact?: string;
  from?: string;
  to?: string;
  search?: string;
}

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(data: CreateTicketDto, userId: number) {
    const ticket = await this.prisma.ticket.create({
      data: {
        ...data,
        createdById: userId,
        serviceStatus: 'OPEN',
        openedAt: data.openedAt ? new Date(data.openedAt) : new Date(),
        estimatedStart: data.estimatedStart
          ? new Date(data.estimatedStart)
          : null,
        closedAt: data.closedAt ? new Date(data.closedAt) : null,
        code: 'TEMP',
      },
    });

    const formattedCode = `TT-${ticket.id.toString().padStart(6, '0')}`;

    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { code: formattedCode },
    });
  }

  // =========================
  // FIND ALL (con filtros)
  // =========================
  async findAll(params: FindTicketsParams) {
    const { userId, scope, status, impact, from, to, search } = params;

    const where: Prisma.TicketWhereInput = {};

    if (scope === 'mine') {
      where.createdById = userId;
    }

    if (status) {
      where.serviceStatus = status;
    }

    if (impact) {
      where.impactLevel = impact;
    }

    if (from || to) {
      where.openedAt = {};
      if (from) where.openedAt.gte = new Date(from);
      if (to) where.openedAt.lte = new Date(to);
    }

    if (search) {
      where.OR = [
        { requestedBy: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { serviceAffected: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.ticket.findMany({
      where,
      include: {
        createdBy: true,
        preliminaryBy: true,
        closingTechnician: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: true,
        preliminaryBy: true,
        closingTechnician: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no existe`);
    }

    return ticket;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, data: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...data,
        estimatedStart: data.estimatedStart
          ? new Date(data.estimatedStart)
          : null,
        closedAt: data.closedAt ? new Date(data.closedAt) : null,
      },
    });
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async updateStatus(id: number, status: TicketStatus) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no existe`);
    }

    return this.prisma.ticket.update({
      where: { id },
      data: {
        serviceStatus: status,
      },
    });
  }

  // =========================
  // DELETE
  // =========================
  async remove(id: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no existe`);
    }

    await this.prisma.ticket.delete({ where: { id } });

    return { message: `Ticket ${ticket.code} eliminado correctamente` };
  }
}
