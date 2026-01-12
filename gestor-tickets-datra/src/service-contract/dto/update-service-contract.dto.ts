import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateServiceContractDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  priorityLevel?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  slaHours?: number;
}
