import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CLIENT_TYPES } from '../types/client-type';
import { IMPACT_LEVELS } from '../types/impact-level.type';

/* =========================
   DTO Cliente (embebido)
========================= */
export class CreateTicketClientDto {
  @IsString()
  @Matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i, { message: 'RFC inválido' })
  rfc!: string;

  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class CreateTicketDto {
  @IsOptional()
  @IsDateString()
  openedAt?: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsIn(CLIENT_TYPES)
  clientType?: string;

  /* =========================
     Cliente (nuevo)
  ========================= */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTicketClientDto)
  client?: CreateTicketClientDto;

  /* =========================
     Incidente
  ========================= */
  @IsOptional()
  @IsString()
  serviceAffected?: string;

  @IsOptional()
  @IsString()
  problemDesc?: string;

  @IsOptional()
  @IsString()
  eventLocation?: string;

  @IsOptional()
  @IsDateString()
  estimatedStart?: string;

  @IsOptional()
  @IsIn(IMPACT_LEVELS)
  impactLevel?: string;

  /* =========================
     Diagnóstico
  ========================= */
  @IsOptional()
  @IsString()
  initialFindings?: string;

  @IsOptional()
  @IsString()
  probableRootCause?: string;

  /* =========================
     Cierre
  ========================= */
  @IsOptional()
  @IsString()
  actionsTaken?: string;

  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  @IsBoolean()
  correctiveAction?: boolean;
}
