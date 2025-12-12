import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  code!: string;

  @IsDateString()
  openedAt!: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  clientType?: string;

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
  @IsString()
  impactLevel?: string;

  @IsOptional()
  @IsString()
  initialFindings?: string;

  @IsOptional()
  @IsString()
  probableRootCause?: string;

  @IsOptional()
  @IsString()
  actionsTaken?: string;

  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @IsOptional()
  @IsString()
  serviceStatus?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  @IsBoolean()
  correctiveAction?: boolean;

  // relaciones (IDs numéricos)
  @IsOptional()
  @IsInt()
  createdById?: number;

  @IsOptional()
  @IsInt()
  preliminaryById?: number;

  @IsOptional()
  @IsInt()
  closingTechnicianId?: number;
}
