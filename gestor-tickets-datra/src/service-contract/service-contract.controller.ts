import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServiceContractService } from './service-contract.service';
import { CreateServiceContractDto } from './dto/create-service-contract.dto';
import { UpdateServiceContractDto } from './dto/update-service-contract.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('service-contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceContractController {
  constructor(private readonly service: ServiceContractService) {}

  // =========================
  // CREATE (ADMIN)
  // =========================
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateServiceContractDto) {
    return this.service.create(dto);
  }

  // =========================
  // READ (OPERATIVO)
  // =========================
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findAll() {
    return this.service.findAll();
  }

  @Get('client/:rfc')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findByClient(@Param('rfc') rfc: string) {
    return this.service.findByClient(rfc);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));
  }

  // =========================
  // UPDATE (ADMIN)
  // =========================
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() dto: UpdateServiceContractDto) {
    return this.service.update(Number(id), dto);
  }

  // =========================
  // DEACTIVATE (ADMIN)
  // =========================
  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  deactivate(@Param('id') id: number) {
    return this.service.deactivate(Number(id));
  }
}
