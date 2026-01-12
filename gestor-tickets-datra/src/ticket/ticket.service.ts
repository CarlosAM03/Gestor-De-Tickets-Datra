import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ImpactLevel,
  TicketStatus,
  TicketEventType,
  TicketSource,
  Prisma,
} from '@prisma/client';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

import {
  TicketCreatedMetadataDto,
  TicketUpdatedMetadataDto,
  TicketClosedMetadataDto,
} from './dto/history';

// ======================================================
// JSON SERIALIZATION BOUNDARY (INTENTIONAL)
// ======================================================
function toJson<T>(data: T): Prisma.InputJsonValue {
  return data as unknown as Prisma.InputJsonValue;
}

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // CREATE
  // ======================================================
  async create(data: CreateTicketDto, userId: number) {
    const client = await this.prisma.client.findUnique({
      where: { rfc: data.clientRfc },
    });

    if (!client || !client.active) {
      throw new BadRequestException('Cliente inválido o desactivado');
    }

    const contract = await this.prisma.serviceContract.findUnique({
      where: { id: data.serviceContractId },
    });

    if (!contract || !contract.active) {
      throw new BadRequestException('Contrato inválido o desactivado');
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        code: 'TEMP',
        status: TicketStatus.OPEN,
        source: TicketSource.MANUAL,

        clientRfc: data.clientRfc,
        serviceContractId: data.serviceContractId,

        impactLevel: data.impactLevel as ImpactLevel,
        problemDescription: data.problemDescription,
        eventLocation: data.eventLocation,
        estimatedStart: data.estimatedStart
          ? new Date(data.estimatedStart)
          : undefined,

        createdById: userId,
      },
    });

    const code = `TT-${ticket.id.toString().padStart(9, '0')}`;

    const metadata = new TicketCreatedMetadataDto({
      requestedBy: data.requestedBy,
      contactInfo: data.contactInfo,
      initialFindings: data.initialFindings,
      probableRootCause: data.probableRootCause,
    });

    await this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id: ticket.id },
        data: { code },
      }),
      this.prisma.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          eventType: TicketEventType.CREATED,
          toStatus: TicketStatus.OPEN,
          performedById: userId,
          metadata: toJson(metadata),
        },
      }),
    ]);

    return this.findOne(ticket.id);
  }

  // ======================================================
  // FIND ALL (LISTADO CONTROLADO)
  // ======================================================
  async findAll(filters: {
    userId: number;
    scope?: 'mine' | 'all';
    status?: TicketStatus;
    impact?: string;
    code?: string;
    rfc?: string;
    from?: string;
    to?: string;
    search?: string;
  }) {
    const where: Prisma.TicketWhereInput = {};

    if (filters.scope !== 'all') {
      where.createdById = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.impact) {
      where.impactLevel = filters.impact as ImpactLevel;
    }

    if (filters.code) {
      where.code = { contains: filters.code };
    }

    if (filters.rfc) {
      where.clientRfc = filters.rfc;
    }

    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search } },
        { problemDescription: { contains: filters.search } },
      ];
    }

    return this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        serviceContract: true,
      },
    });
  }

  // ======================================================
  // UPDATE (INFORMATIVO)
  // ======================================================
  async update(id: number, data: UpdateTicketDto, userId: number) {
    const ticket = await this.findOne(id);

    if (
      ticket.status === TicketStatus.CLOSED ||
      ticket.status === TicketStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        'No se puede editar un ticket cerrado o cancelado',
      );
    }

    const metadata = new TicketUpdatedMetadataDto({
      eventLocation: data.eventLocation,
      estimatedStart: data.estimatedStart,
      initialFindings: data.initialFindings,
      probableRootCause: data.probableRootCause,
      actionsTaken: data.actionsTaken,
      additionalNotes: data.additionalNotes,
      correctiveAction: data.correctiveAction,
    });

    await this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id },
        data: {
          eventLocation: data.eventLocation,
          estimatedStart: data.estimatedStart
            ? new Date(data.estimatedStart)
            : undefined,
        },
      }),
      this.prisma.ticketHistory.create({
        data: {
          ticketId: id,
          eventType: TicketEventType.UPDATED,
          performedById: userId,
          metadata: toJson(metadata),
        },
      }),
    ]);

    return this.findOne(id);
  }

  // ======================================================
  // RESOLVE
  // OPEN → RESOLVED
  // ======================================================
  async resolve(id: number, userId: number) {
    const ticket = await this.findOne(id);

    if (ticket.status !== TicketStatus.OPEN) {
      throw new ForbiddenException('Solo tickets OPEN pueden resolverse');
    }

    await this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id },
        data: {
          status: TicketStatus.RESOLVED,
          resolvedAt: new Date(),
        },
      }),
      this.prisma.ticketHistory.create({
        data: {
          ticketId: id,
          eventType: TicketEventType.STATUS_CHANGED,
          fromStatus: TicketStatus.OPEN,
          toStatus: TicketStatus.RESOLVED,
          performedById: userId,
        },
      }),
    ]);

    return this.findOne(id);
  }

  // ======================================================
  // CLOSE
  // RESOLVED → CLOSED
  // ======================================================
  async close(id: number, userId: number, serviceStatus?: string) {
    const ticket = await this.findOne(id);

    if (ticket.status !== TicketStatus.RESOLVED) {
      throw new ForbiddenException('Solo tickets RESOLVED pueden cerrarse');
    }

    const metadata = new TicketClosedMetadataDto({
      serviceStatus,
      closedAt: new Date().toISOString(),
    });

    await this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id },
        data: {
          status: TicketStatus.CLOSED,
          closedAt: new Date(),
          closedById: userId,
        },
      }),
      this.prisma.ticketHistory.create({
        data: {
          ticketId: id,
          eventType: TicketEventType.CLOSED,
          fromStatus: TicketStatus.RESOLVED,
          toStatus: TicketStatus.CLOSED,
          performedById: userId,
          metadata: toJson(metadata),
        },
      }),
    ]);

    return this.findOne(id);
  }

  // ======================================================
  // CANCEL
  // OPEN / RESOLVED → CANCELLED
  // ======================================================
  async cancel(id: number, userId: number, reason: string) {
    if (!reason || reason.trim().length === 0) {
      throw new BadRequestException(
        'La cancelación requiere una justificación',
      );
    }

    const ticket = await this.findOne(id);

    if (
      ticket.status !== TicketStatus.OPEN &&
      ticket.status !== TicketStatus.RESOLVED
    ) {
      throw new ForbiddenException(
        'Solo tickets OPEN o RESOLVED pueden cancelarse',
      );
    }

    await this.prisma.$transaction([
      this.prisma.ticket.update({
        where: { id },
        data: {
          status: TicketStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelledById: userId,
        },
      }),
      this.prisma.ticketHistory.create({
        data: {
          ticketId: id,
          eventType: TicketEventType.CANCELLED,
          fromStatus: ticket.status,
          toStatus: TicketStatus.CANCELLED,
          performedById: userId,
          metadata: toJson({ reason }),
        },
      }),
    ]);

    return this.findOne(id);
  }

  // ======================================================
  // FIND ONE (DETALLE + HISTORIAL)
  // ======================================================
  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        client: true,
        serviceContract: true,
        createdBy: true,
        closedBy: true,
        cancelledBy: true,
        history: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} no encontrado`);
    }

    return ticket;
  }
}
