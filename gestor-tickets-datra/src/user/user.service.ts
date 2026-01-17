import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateSelfUserDto } from './dto/update-self-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // INTERNAL
  // ======================================================
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // ======================================================
  // CREATE (ADMIN)
  // ======================================================
  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await this.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role ?? UserRole.TECNICO,
        active: true,
      },
    });
  }

  // ======================================================
  // FIND BY EMAIL (AUTH)
  // ======================================================
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ======================================================
  // FIND ALL (ADMIN)
  // ======================================================
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
  // ======================================================
  // FIND ME (SELF)
  // ======================================================
  async findMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.active) {
      throw new ForbiddenException('Usuario inactivo o inválido');
    }

    return user;
  }

  // ======================================================
  // FIND ONE
  // ======================================================
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }

  // ======================================================
  // UPDATE SELF (NAME / PASSWORD)
  // ======================================================
  async updateSelf(userId: number, data: UpdateSelfUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.active) {
      throw new ForbiddenException('Usuario inactivo o inválido');
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.password !== undefined) {
      updateData.password = await this.hashPassword(data.password);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  // ======================================================
  // ADMIN UPDATE (NO PASSWORD)
  // ======================================================
  async adminUpdate(userId: number, data: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    if (data.active === false && user.active === true) {
      updateData.active = false;
      updateData.deactivatedAt = new Date();
    }

    if (data.active === true && user.active === false) {
      updateData.active = true;
      updateData.deactivatedAt = null;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
