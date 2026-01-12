import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../types/request-with-user';
import { TICKET_STATUSES, TicketStatus } from './types/ticket-status.type';
import { ImpactLevel, UserRole } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // ======================================================
  // CREATE
  // ======================================================
  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  create(@Body() body: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.ticketService.create(body, req.user.id);
  }

  // ======================================================
  // FIND ALL
  // ======================================================
  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findAll(
    @Req() req: RequestWithUser,
    @Query('scope') scope?: 'mine' | 'all',
    @Query('status') status?: string,
    @Query('impact') impact?: ImpactLevel,
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

  // ======================================================
  // FIND ONE
  // ======================================================
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOne(id);
  }

  // ======================================================
  // UPDATE INFO (NO STATUS)
  // ======================================================
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO, UserRole.INGENIERO)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTicketDto,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.update(id, body, req.user.id);
  }

  // ======================================================
  // RESOLVE
  // OPEN → RESOLVED
  // ======================================================
  @Patch(':id/resolve')
  @Roles(UserRole.TECNICO, UserRole.INGENIERO, UserRole.ADMIN)
  resolve(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.ticketService.resolve(id, req.user.id);
  }

  // ======================================================
  // CLOSE
  // RESOLVED → CLOSED
  // ======================================================
  @Patch(':id/close')
  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  close(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.ticketService.close(id, req.user.id);
  }

  // ======================================================
  // CANCEL
  // OPEN / RESOLVED → CANCELLED
  // ======================================================
  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Body('reason') reason: string,
  ) {
    return this.ticketService.cancel(id, req.user.id, reason);
  }
}
