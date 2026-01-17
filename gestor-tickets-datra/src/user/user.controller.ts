import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateSelfUserDto } from './dto/update-self-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import type { RequestWithUser } from '../types/request-with-user';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ======================================================
  // POST /users
  // Crear usuario (ADMIN)
  // ======================================================
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  // ======================================================
  // GET /users
  // Obtener todos los usuarios (ADMIN)
  // ======================================================
  @Get()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.userService.findAll();
  }
  // ======================================================
  // GET /users/me
  // Obtener perfil propio (SELF)
  // ======================================================
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async findMe(@Req() req: RequestWithUser) {
    return this.userService.findMe(req.user.id);
  }

  // ======================================================
  // GET /users/:id
  // ADMIN o el mismo usuario
  // ======================================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new ForbiddenException('Identificador de usuario inválido');
    }

    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este usuario');
    }

    return this.userService.findOne(userId);
  }

  // ======================================================
  // PATCH /users/me
  // Actualizar datos propios (SELF)
  // ======================================================
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateSelf(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateSelfUserDto,
  ) {
    return this.userService.updateSelf(req.user.id, dto);
  }

  // ======================================================
  // PATCH /users/:id
  // Admin update (rol / email / estado)
  // ======================================================
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async adminUpdate(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new ForbiddenException('Identificador de usuario inválido');
    }

    return this.userService.adminUpdate(userId, dto);
  }
}
