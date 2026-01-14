import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { toClientResponseDto } from './mappers/clients.mapper';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ======================================================
  // POST /clients
  // ADMIN ONLY
  // ======================================================
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.clientsService.create(dto);
    return toClientResponseDto(client);
  }

  // ======================================================
  // GET /clients/:rfc
  // Roles: ADMIN / TECNICO / INGENIERO
  // ======================================================
  @Get(':rfc')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  @HttpCode(HttpStatus.OK)
  async findByRfc(@Param('rfc') rfc: string): Promise<ClientResponseDto> {
    const client = await this.clientsService.findByRfc(rfc.toUpperCase());
    return toClientResponseDto(client);
  }

  // ======================================================
  // GET /clients?q=ABC
  // Autocomplete (solo activos)
  // ======================================================
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  @HttpCode(HttpStatus.OK)
  async search(@Query('q') query?: string): Promise<ClientResponseDto[]> {
    if (!query) {
      return [];
    }

    const clients = await this.clientsService.search(query);
    return clients.map(toClientResponseDto);
  }

  // ======================================================
  // PATCH /clients/:rfc/deactivate
  // ADMIN ONLY
  // ======================================================
  @Patch(':rfc/deactivate')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('rfc') rfc: string) {
    return this.clientsService.deactivate(rfc.toUpperCase());
  }

  // ======================================================
  // PATCH /clients/:rfc/activate
  // ADMIN ONLY
  // ======================================================
  @Patch(':rfc/activate')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async activate(@Param('rfc') rfc: string) {
    return this.clientsService.activate(rfc.toUpperCase());
  }
}
