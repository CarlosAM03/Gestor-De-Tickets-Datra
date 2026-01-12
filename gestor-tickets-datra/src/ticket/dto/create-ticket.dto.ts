import {
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  IsInt,
} from 'class-validator';
import { IMPACT_LEVELS } from '../types/impact-level.type';

export class CreateTicketDto {
  // =========================
  // CLIENTE / SERVICIO
  // =========================
  @IsString()
  clientRfc!: string;

  @IsInt()
  serviceContractId!: number;

  // =========================
  // INFORMACIÓN GENERAL
  // =========================
  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;

  // =========================
  // INCIDENTE
  // =========================
  @IsIn(IMPACT_LEVELS)
  impactLevel!: string;

  @IsString()
  problemDescription!: string;

  @IsOptional()
  @IsString()
  eventLocation?: string;

  @IsOptional()
  @IsDateString()
  estimatedStart?: string;

  // =========================
  // DIAGNÓSTICO
  // =========================
  @IsOptional()
  @IsString()
  initialFindings?: string;

  @IsOptional()
  @IsString()
  probableRootCause?: string;

  // =========================
  // CIERRE (solo editable luego)
  // =========================
  @IsOptional()
  @IsString()
  actionsTaken?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  correctiveAction?: boolean;
}
