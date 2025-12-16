import { IsOptional, IsString } from 'class-validator';

export class RequestDeleteTicketDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
