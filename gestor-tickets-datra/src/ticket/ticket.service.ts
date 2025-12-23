import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  Prisma,
  ClientType,
  ImpactLevel,
  TicketStatus as PrismaTicketStatus,
  UserRole,
} from '@prisma/client';
import type { TicketStatus } from './types/ticket-status.type';

interface FindTicketsParams {
  userId: number;
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  impact?: string;

  // NUEVOS (no rompen nada)
  rfc?: string;
  code?: string;

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
    let clientRfc: string | null = null;
    // =========================
    // UPSERT CLIENT (RFC)
    // =========================
    if (data.client && typeof data.client.rfc === 'string') {
      const client = await this.prisma.client.upsert({
        where: { rfc: data.client.rfc },
        update: {
          companyName: data.client.companyName,
          businessName: data.client.businessName,
          location: data.client.location,
        },
        create: {
          rfc: data.client.rfc,
          companyName: data.client.companyName,
          businessName: data.client.businessName,
          location: data.client.location,
        },
      });

      clientRfc = client.rfc;
    }

    // =========================
    // CREATE TICKET
    // =========================
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

        clientRfc, // 🔗 asociación cliente-ticket

        code: 'TEMP',
      },
    });

    const formattedCode = `TT-${ticket.id.toString().padStart(6, '0')}`;

    // =========================
    // UPDATE CODE + HISTORY
    // =========================
    await this.prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        action: 'CREATE_TICKET',
        fromValue: null,
        toValue: `clientRfc=${clientRfc ?? 'N/A'}`,
        performedById: userId,
        clientRfc,
      },
    });

    return this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { code: formattedCode },
    });
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll(params: FindTicketsParams) {
    const { userId, scope, status, impact, rfc, code, from, to, search } =
      params;

    const where: Prisma.TicketWhereInput = {
      deletedAt: null,
    };

    if (scope === 'mine') {
      where.createdById = userId;
    }

    if (status) {
      where.status = status as PrismaTicketStatus;
    }

    if (impact) {
      where.impactLevel = impact as ImpactLevel;
    }
    if (code) {
      where.code = {
        contains: code,
        mode: 'insensitive',
      };
    }

    if (rfc) {
      where.clientRfc = {
        contains: rfc,
        mode: 'insensitive',
      };
    }

    if (from || to) {
      where.openedAt = {};
      if (from) where.openedAt.gte = new Date(from);
      if (to) where.openedAt.lte = new Date(to);
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { requestedBy: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { serviceAffected: { contains: search, mode: 'insensitive' } },
        { clientRfc: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.ticket.findMany({
      where,
      include: {
        client: true,
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
        client: true, // ✅ CLIENTE
        createdBy: true,
        preliminaryBy: true,
        closingTechnician: true,
        deletedBy: true, // ✅ AUDITORÍA
        history: {
          // ✅ HISTORIAL
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con id ${id} no existe`);
    }

    return ticket;
  }

  // =========================
  // UPDATE INFO
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
  // UPDATE STATUS / CLOSE
  // =========================
  async updateStatus(id: number, status: TicketStatus) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return this.prisma.ticket.update({
      where: { id },
      data: {
        status: status as PrismaTicketStatus,
        closedAt:
          status === PrismaTicketStatus.CLOSED ? new Date() : ticket.closedAt,
      },
    });
  }

  // =========================
  // REQUEST DELETE
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

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('Usuario inválido');
    }

    // 🔐 REGLAS POR ROL
    if (user.role === UserRole.TECNICO && ticket.createdById !== userId) {
      throw new ForbiddenException(
        'Solo puedes solicitar eliminación de tus propios tickets',
      );
    }

    // INGENIERO → puede solicitar cualquiera
    // ADMIN → puede solicitar cualquiera

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        deleteRequested: true,
      },
    });
  }

  // =========================
  // ADMIN – APPROVE DELETE
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
        'Ticket no encontrado o sin solicitud de eliminación',
      );
    }

    return this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id: ticketId },
        data: {
          deletedAt: new Date(),
          deletedById: adminId,
          deleteRequested: false,
          status: PrismaTicketStatus.CANCELLED,
        },
      }),

      this.prisma.ticketHistory.create({
        data: {
          ticketId,
          action: 'APPROVE_DELETE',
          fromValue: 'deleteRequested=true',
          toValue: 'status=CANCELLED, deletedAt=SET',
          performedById: adminId,
        },
      }),
    ]);
  }

  // =========================
  // ADMIN – LIST DELETE REQUESTS
  // =========================
  async findDeleteRequests() {
    return this.prisma.ticket.findMany({
      where: {
        deleteRequested: true,
        deletedAt: null,
      },
      include: {
        createdBy: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // =========================
  // ADMIN – HISTORY
  // =========================
  async getHistory(ticketId: number) {
    return this.prisma.ticketHistory.findMany({
      where: { ticketId },
      include: {
        performedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================
  // ADMIN – REJECT DELETE
  // =========================
  async rejectDelete(ticketId: number, adminId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        deleteRequested: true,
        deletedAt: null,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id: ticketId },
        data: {
          deleteRequested: false,
        },
      }),

      this.prisma.ticketHistory.create({
        data: {
          ticketId,
          action: 'REJECT_DELETE',
          fromValue: 'deleteRequested=true',
          toValue: 'deleteRequested=false',
          performedById: adminId,
        },
      }),
    ]);
  }
}
