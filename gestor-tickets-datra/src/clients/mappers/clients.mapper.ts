import { Client } from '@prisma/client';
import { ClientResponseDto } from '../dto/client-response.dto';

export function toClientResponseDto(client: Client): ClientResponseDto {
  return {
    rfc: client.rfc,
    clientNumber: client.clientNumber,
    companyName: client.companyName ?? undefined,
    businessName: client.businessName ?? undefined,
    location: client.location ?? undefined,
    active: client.active,
  };
}
