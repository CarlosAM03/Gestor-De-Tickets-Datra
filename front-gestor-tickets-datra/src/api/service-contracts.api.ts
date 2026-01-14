// src/api/service-contract.api.ts
import http from './http';
import type { ServiceContract } from '@/types/service-contract-types/service-contract.types';
import type {
  CreateServiceContractPayload,
  UpdateServiceContractPayload,
} from '@/types/service-contract-types/service-contract.dto';

// READ ALL
export const getServiceContracts = async (): Promise<ServiceContract[]> => {
  const { data } = await http.get<ServiceContract[]>('/service-contracts');
  return data;
};

// READ BY CLIENT
export const getServiceContractsByClient = async (
  rfc: string,
): Promise<ServiceContract[]> => {
  const { data } = await http.get<ServiceContract[]>(
    `/service-contracts/client/${rfc}`,
  );
  return data;
};

// READ ONE
export const getServiceContractById = async (
  id: number,
): Promise<ServiceContract> => {
  const { data } = await http.get<ServiceContract>(
    `/service-contracts/${id}`,
  );
  return data;
};

// CREATE (ADMIN)
export const createServiceContract = async (
  payload: CreateServiceContractPayload,
): Promise<ServiceContract> => {
  const { data } = await http.post<ServiceContract>(
    '/service-contracts',
    payload,
  );
  return data;
};

// UPDATE (ADMIN)
export const updateServiceContract = async (
  id: number,
  payload: UpdateServiceContractPayload,
): Promise<ServiceContract> => {
  const { data } = await http.patch<ServiceContract>(
    `/service-contracts/${id}`,
    payload,
  );
  return data;
};

// DEACTIVATE (ADMIN)
export const deactivateServiceContract = async (
  id: number,
): Promise<ServiceContract> => {
  const { data } = await http.patch<ServiceContract>(
    `/service-contracts/${id}/deactivate`,
  );
  return data;
};
