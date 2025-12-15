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
import { TICKET_STATUSES, TicketStatus } from './dto/ticket-status.type';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() body: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.ticketService.create(body, req.user.id);
  }

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
    // Convertir status a tipo TicketStatus
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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTicketDto) {
    return this.ticketService.update(id, body);
  }

  // ✅ CAMBIO DE ESTADO
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: StatusUpdateTicketDto,
  ) {
    return this.ticketService.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.remove(id);
  }
}
