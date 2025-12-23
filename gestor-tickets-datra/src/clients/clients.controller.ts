import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard) // protegido (ajustable luego)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /* =========================
     GET /clients/:rfc
  ========================= */
  @Get(':rfc')
  async findByRfc(@Param('rfc') rfc: string) {
    return this.clientsService.findByRfc(rfc.toUpperCase());
  }

  /* =========================
     GET /clients?q=ABC
     Autocomplete
  ========================= */
  @Get()
  async search(@Query('q') query?: string) {
    if (!query) {
      return [];
    }

    return this.clientsService.search(query);
  }
}
