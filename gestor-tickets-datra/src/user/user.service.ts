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
import { Prisma, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // INTERNAL HELPERS
  // ======================================================
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private toUserResponse(user: User) {
    const { password, ...safeUser } = user;

    // Marca uso intencional para ESLint (NO runtime effect)
    void password;

    return safeUser;
  }

  // ======================================================
  // CREATE (ADMIN)
  // ======================================================
  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role ?? UserRole.TECNICO,
        active: true,
      },
    });

    return this.toUserResponse(user);
  }

  // ======================================================
  // FIND BY EMAIL (AUTH ONLY)
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
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return users.map((u) => this.toUserResponse(u));
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

    return this.toUserResponse(user);
  }

  // ======================================================
  // FIND ONE (ADMIN)
  // ======================================================
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return this.toUserResponse(user);
  }

  // ======================================================
  // UPDATE SELF (NAME / PASSWORD)
  // ======================================================
  async updateSelf(userId: number, dto: UpdateSelfUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.active) {
      throw new ForbiddenException('Usuario inactivo o inválido');
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.password !== undefined) {
      updateData.password = await this.hashPassword(dto.password);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.toUserResponse(updated);
  }

  // ======================================================
  // ADMIN UPDATE (NO PASSWORD)
  // ======================================================
  async adminUpdate(userId: number, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }

    if (dto.role !== undefined) {
      updateData.role = dto.role;
    }

    if (dto.active === false && user.active === true) {
      updateData.active = false;
      updateData.deactivatedAt = new Date();
    }

    if (dto.active === true && user.active === false) {
      updateData.active = true;
      updateData.deactivatedAt = null;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.toUserResponse(updated);
  }
}
