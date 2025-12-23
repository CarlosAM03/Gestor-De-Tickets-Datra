import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /* =========================
     GET CLIENT BY RFC
  ========================= */
  async findByRfc(rfc: string) {
    const client = await this.prisma.client.findUnique({
      where: { rfc },
    });

    if (!client) {
      throw new NotFoundException(`Cliente con RFC ${rfc} no encontrado`);
    }

    return client;
  }

  /* =========================
     SEARCH CLIENTS (Autocomplete)
     ?q=ABC
  ========================= */
  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.prisma.client.findMany({
      where: {
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

  /* =========================
     INTERNAL UPSERT (opcional)
     (por si luego se usa fuera de tickets)
  ========================= */
  async upsert(data: Prisma.ClientCreateInput) {
    return this.prisma.client.upsert({
      where: { rfc: data.rfc },
      update: {
        companyName: data.companyName,
        businessName: data.businessName,
        location: data.location,
      },
      create: data,
    });
  }
}
