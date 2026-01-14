// src/types/service-contract.types.ts
import type { ServiceContractName } from '../enums';

export interface ServiceContract {
  id: number;
  name: ServiceContractName;
  priorityLevel: number;
  slaHours: number;

  active: boolean;
  deactivatedAt: string | null;

  clientRfc: string;

  createdAt: string;
  updatedAt: string;
}
