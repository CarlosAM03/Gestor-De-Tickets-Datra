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
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // =========================
  // CREATE
  // =========================
  @Post()
  create(@Body() body: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.ticketService.create(body, req.user.id);
  }

  // =========================
  // FIND ALL
  // =========================
  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query('scope') scope?: 'mine' | 'all',
    @Query('status') status?: string,
    @Query('impact') impact?: string,
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
      from,
      to,
      search,
    });
  }

  // =========================
  // FIND ONE
  // =========================
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOne(id);
  }

  // =========================
  // UPDATE
  // =========================
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTicketDto) {
    return this.ticketService.update(id, body);
  }

  // =========================
  // UPDATE STATUS
  // =========================
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: StatusUpdateTicketDto,
  ) {
    return this.ticketService.updateStatus(id, body.status);
  }

  // =========================
  // REQUEST DELETE (SOFT)
  // =========================
  @Delete(':id')
  requestDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.requestDelete(id, req.user.id);
  }
  // =========================
  // LIST DELETE REQUESTS (ADMIN)
  // =========================
  @Get('admin/delete-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findDeleteRequests() {
    return this.ticketService.findDeleteRequests();
  }
  // =========================
  // ADMIN – APPROVE DELETE
  // =========================
  @Patch('admin/:id/approve-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approveDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.approveDelete(id, req.user.id);
  }
  // =========================
  // ADMIN – TICKET HISTORY
  // =========================
  @Get(':id/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.getHistory(id);
  }
  @Patch('admin/:id/reject-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  rejectDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.ticketService.rejectDelete(id, req.user.id);
  }
}
