import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { CLIENT_TYPES } from '../types/client-type';
import { IMPACT_LEVELS } from '../types/impact-level.type';

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
  additionalNotes?: string;

  @IsOptional()
  @IsBoolean()
  correctiveAction?: boolean;
}
