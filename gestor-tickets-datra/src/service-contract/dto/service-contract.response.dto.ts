import { ServiceContractName } from '@prisma/client';

export class ServiceContractResponseDto {
  id!: number;
  name!: ServiceContractName;
  priorityLevel?: number;
  slaHours?: number;
  active?: boolean;
  clientRfc?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
