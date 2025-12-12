import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear usuario
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  // Obtener todos
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Obtener uno por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  // Eliminar usuario
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
