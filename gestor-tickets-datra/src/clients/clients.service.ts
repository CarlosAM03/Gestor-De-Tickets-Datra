import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // CREATE (ADMIN / IMPORT)
  // ======================================================
  async create(dto: CreateClientDto) {
    const existing = await this.prisma.client.findUnique({
      where: { rfc: dto.rfc },
    });

    if (existing) {
      throw new BadRequestException(`Cliente con RFC ${dto.rfc} ya existe`);
    }

    return this.prisma.client.create({
      data: {
        rfc: dto.rfc,
        clientNumber: dto.clientNumber,
        companyName: dto.companyName,
        businessName: dto.businessName,
        location: dto.location,
        active: true,
      },
    });
  }

  // ======================================================
  // Lista Completa de Clientes activos
  // Usado por ClientList
  // ======================================================
  async findAll(activeOnly = true) {
    return this.prisma.client.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: {
        companyName: 'asc',
      },
    });
  }

  // ======================================================
  // READ — ACTIVE CLIENT (PUBLIC DOMAIN CONTRACT)
  // Usado por Tickets y Frontend
  // ======================================================
  async findByRfc(rfc: string) {
    const client = await this.prisma.client.findUnique({
      where: { rfc },
    });

    if (!client || !client.active) {
      throw new NotFoundException(
        `Cliente activo con RFC ${rfc} no encontrado`,
      );
    }

    return client;
  }

  // ======================================================
  // READ — ANY CLIENT (ADMIN / IMPORT INTERNAL)
  // Incluye inactivos
  // ======================================================
  async findAnyByRfc(rfc: string) {
    const client = await this.prisma.client.findUnique({
      where: { rfc },
    });

    if (!client) {
      throw new NotFoundException(`Cliente con RFC ${rfc} no encontrado`);
    }

    return client;
  }

  // ======================================================
  // SEARCH (Autocomplete Frontend)
  // SOLO clientes activos
  // ======================================================
  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.prisma.client.findMany({
      where: {
        active: true,
        OR: [
          {
            rfc: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            companyName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            businessName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        companyName: 'asc',
      },
      take: 10,
    });
  }

  // ======================================================
  // UPDATE (ADMIN)
  // RFC & clientNumber INMUTABLES
  // ======================================================
  async update(rfc: string, dto: UpdateClientDto) {
    await this.findAnyByRfc(rfc);

    return this.prisma.client.update({
      where: { rfc },
      data: {
        companyName: dto.companyName,
        businessName: dto.businessName,
        location: dto.location,
      },
    });
  }

  // ======================================================
  // DEACTIVATE (ADMIN)
  // Soft delete — histórico intacto
  // ======================================================
  async deactivate(rfc: string) {
    const client = await this.findAnyByRfc(rfc);

    if (!client.active) {
      return client;
    }

    return this.prisma.client.update({
      where: { rfc },
      data: {
        active: false,
        deactivatedAt: new Date(),
      },
    });
  }

  // ======================================================
  // ACTIVATE (ADMIN)
  // Reactiva cliente previamente desactivado
  // ======================================================
  async activate(rfc: string) {
    const client = await this.findAnyByRfc(rfc);

    if (client.active) {
      return client;
    }

    return this.prisma.client.update({
      where: { rfc },
      data: {
        active: true,
        deactivatedAt: null,
      },
    });
  }

  // ======================================================
  // INTERNAL UPSERT (IMPORT / SYNC)
  // NO EXPONER POR CONTROLLER
  // ======================================================
  async upsert(data: Prisma.ClientCreateInput) {
    return this.prisma.client.upsert({
      where: { rfc: data.rfc },
      update: {
        companyName: data.companyName,
        businessName: data.businessName,
        location: data.location,
        active: data.active ?? true,
      },
      create: data,
    });
  }
}
