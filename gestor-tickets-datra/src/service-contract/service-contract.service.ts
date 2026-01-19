import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceContractDto } from './dto/create-service-contract.dto';
import { UpdateServiceContractDto } from './dto/update-service-contract.dto';

@Injectable()
export class ServiceContractService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CREATE
  // =========================
  async create(dto: CreateServiceContractDto) {
    const client = await this.prisma.client.findUnique({
      where: { rfc: dto.clientRfc },
    });

    if (!client || !client.active) {
      throw new BadRequestException('Cliente inválido o inactivo');
    }

    return this.prisma.serviceContract.create({
      data: {
        name: dto.name,
        priorityLevel: dto.priorityLevel,
        slaHours: dto.slaHours,
        clientRfc: dto.clientRfc,
      },
    });
  }

  // =========================
  // READ
  // =========================
  async findAll() {
    return this.prisma.serviceContract.findMany({
      orderBy: { priorityLevel: 'asc' },
    });
  }

  /**
   * Devuelve TODOS los contratos del cliente
   * (activos e inactivos)
   */
  async findByClient(clientRfc: string) {
    return this.prisma.serviceContract.findMany({
      where: {
        clientRfc,
      },
      orderBy: { priorityLevel: 'asc' },
    });
  }

  async findOne(id: number) {
    const contract = await this.prisma.serviceContract.findUnique({
      where: { id },
    });

    if (!contract) {
      throw new NotFoundException(`Contrato ${id} no encontrado`);
    }

    return contract;
  }

  // =========================
  // UPDATE
  // =========================
  async update(id: number, dto: UpdateServiceContractDto) {
    await this.findOne(id);

    return this.prisma.serviceContract.update({
      where: { id },
      data: dto,
    });
  }

  // =========================
  // DEACTIVATE
  // =========================
  async deactivate(id: number) {
    const contract = await this.findOne(id);

    if (!contract.active) {
      return contract;
    }

    return this.prisma.serviceContract.update({
      where: { id },
      data: {
        active: false,
        deactivatedAt: new Date(),
      },
    });
  }

  // =========================
  // ACTIVATE
  // =========================
  async activate(id: number) {
    const contract = await this.findOne(id);

    if (contract.active) {
      return contract;
    }

    return this.prisma.serviceContract.update({
      where: { id },
      data: {
        active: true,
        deactivatedAt: null,
      },
    });
  }
}
