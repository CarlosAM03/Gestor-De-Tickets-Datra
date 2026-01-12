import { ServiceContractName } from '@prisma/client';
import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator';

export class CreateServiceContractDto {
  @IsString()
  clientRfc!: string;

  @IsEnum(ServiceContractName)
  name!: ServiceContractName;

  @IsInt()
  @IsPositive()
  priorityLevel!: number;

  @IsInt()
  @IsPositive()
  slaHours!: number;
}
