import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { StatusUpdateTicketDto } from './dto/status-update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../types/request-with-user';
import { TICKET_STATUSES, TicketStatus } from './types/ticket-status.type';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // =========================
  // CREATE TICKET
  // Roles: ADMIN, TECNICO, INGENIERO
  // =========================
  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  create(@Body() body: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.ticketService.create(body, req.user.id);
  }

  // =========================
  // FIND ALL (global / mine + filtros)
  // Roles: ADMIN, TECNICO, INGENIERO
  // =========================
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findAll(
    @Req() req: RequestWithUser,
    @Query('scope') scope?: 'mine' | 'all',
    @Query('status') status?: string,
    @Query('impact') impact?: string,
    @Query('code') code?: string,
    @Query('rfc') rfc?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('search') search?: string,
  ) {
    const validStatus = TICKET_STATUSES.includes(status as TicketStatus)
      ? (status as TicketStatus)
      : undefined;

    return this.ticketService.findAll({
      userId: req.user.id,
      scope,
      status: validStatus,
      impact,
      code,
      rfc,
      from,
      to,
      search,
    });
  }

  // =========================
  // FIND ONE
  // Roles: ADMIN, TECNICO, INGENIERO
  // =========================
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOne(id);
  }

  // =========================
  // UPDATE TICKET INFO
  // Roles: ADMIN, TECNICO, INGENIERO
  // =========================
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTicketDto) {
    return this.ticketService.update(id, body);
  }

  // =========================
  // UPDATE STATUS / CLOSE TICKET
  // Roles: ADMIN, TECNICO, INGENIERO
  // =========================
  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: StatusUpdateTicketDto,
  ) {
    return this.ticketService.updateStatus(id, body.status);
  }

  // =========================
  // REQUEST DELETE (SOFT DELETE)
  // Roles: ADMIN, TECNICO, INGENIERO
  // Reglas finas se validan en el SERVICE
  // =========================
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  requestDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.requestDelete(id, req.user.id);
  }

  // =========================
  // ADMIN – LIST DELETE REQUESTS
  // =========================
  @Get('admin/delete-requests')
  @Roles(UserRole.ADMIN)
  findDeleteRequests() {
    return this.ticketService.findDeleteRequests();
  }

  // =========================
  // ADMIN – APPROVE DELETE
  // =========================
  @Patch('admin/:id/approve-delete')
  @Roles(UserRole.ADMIN)
  approveDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.approveDelete(id, req.user.id);
  }

  // =========================
  // ADMIN – REJECT DELETE
  // =========================
  @Patch('admin/:id/reject-delete')
  @Roles(UserRole.ADMIN)
  rejectDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.rejectDelete(id, req.user.id);
  }

  // =========================
  // ADMIN – TICKET HISTORY
  // =========================
  @Get(':id/history')
  @Roles(UserRole.ADMIN)
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.getHistory(id);
  }
}
