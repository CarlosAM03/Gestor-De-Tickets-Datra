import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Prisma, ClientType, ImpactLevel } from '@prisma/client';
import { TicketStatus } from './types/ticket-status.type';

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
        requestedBy: data.requestedBy,
        contact: data.contact,
        clientType: data.clientType ? (data.clientType as ClientType) : null,
        serviceAffected: data.serviceAffected,
        problemDesc: data.problemDesc,
        eventLocation: data.eventLocation,
        impactLevel: data.impactLevel
          ? (data.impactLevel as ImpactLevel)
          : null,
        initialFindings: data.initialFindings,
        probableRootCause: data.probableRootCause,
        actionsTaken: data.actionsTaken,
        additionalNotes: data.additionalNotes,
        correctiveAction: data.correctiveAction,

        createdById: userId,
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
  // FIND ALL
  // =========================
  async findAll(params: FindTicketsParams) {
    const { userId, scope, status, impact, from, to, search } = params;

    const where: Prisma.TicketWhereInput = {
      deletedAt: null,
    };

    if (scope === 'mine') {
      where.createdById = userId;
    }

    if (status) {
      where.status = status;
    }

    if (impact) {
      where.impactLevel = impact as ImpactLevel;
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
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id,
        deletedAt: null,
      },
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
        requestedBy: data.requestedBy,
        contact: data.contact,
        clientType: data.clientType ? (data.clientType as ClientType) : null,
        serviceAffected: data.serviceAffected,
        problemDesc: data.problemDesc,
        eventLocation: data.eventLocation,
        impactLevel: data.impactLevel
          ? (data.impactLevel as ImpactLevel)
          : null,
        initialFindings: data.initialFindings,
        probableRootCause: data.probableRootCause,
        actionsTaken: data.actionsTaken,
        additionalNotes: data.additionalNotes,
        correctiveAction: data.correctiveAction,
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
      data: { status },
    });
  }
  // =========================
  // Solicitud de eliminación
  // =========================
  async requestDelete(ticketId: number, userId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        deletedAt: null,
      },
      include: {
        createdBy: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    // 🔒 Regla: solo el creador puede solicitar eliminación
    if (ticket.createdById !== userId) {
      throw new NotFoundException(
        'No tienes permisos para solicitar la eliminación de este ticket',
      );
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        deleteRequested: true,
      },
    });
  }

  // =========================
  // Aprobación y soft delete (ADMIN)
  // =========================
  async approveDelete(ticketId: number, adminId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        deleteRequested: true,
        deletedAt: null,
      },
    });

    if (!ticket) {
      throw new NotFoundException(
        'Ticket no encontrado o no tiene solicitud de eliminación',
      );
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        deletedAt: new Date(),
        deletedById: adminId,
        deleteRequested: false,
        status: 'CANCELLED',
      },
    });
  }
}
