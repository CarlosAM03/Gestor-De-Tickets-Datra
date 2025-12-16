import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import type { RequestWithUser } from '../types/request-with-user';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ==========================
  // Crear usuario (ADMIN)
  // ==========================
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  // ==========================
  // Obtener todos (ADMIN)
  // ==========================
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  // ==========================
  // Obtener usuario por id
  // ADMIN o el mismo usuario
  // ==========================
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = Number(id);

    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este usuario');
    }

    return this.userService.findOne(userId);
  }

  // ==========================
  // Eliminar usuario (ADMIN)
  // ==========================
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
