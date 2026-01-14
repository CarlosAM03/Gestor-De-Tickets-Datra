// src/types/service-contract.dto.ts
import type { ServiceContractName } from '../enums';

export interface CreateServiceContractPayload {
  clientRfc: string;
  name: ServiceContractName;
  priorityLevel: number;
  slaHours: number;
}

export interface UpdateServiceContractPayload {
  priorityLevel?: number;
  slaHours?: number;
}
