// src/api/service-contracts.api.ts
import http from './http';

import type { ServiceContract } from '@/types/service-contract-types/service-contract.types';
import type {
  CreateServiceContractPayload,
  UpdateServiceContractPayload,
} from '@/types/service-contract-types/service-contract.dto';

/* ================================
   API RESPONSE WRAPPER
================================ */
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* ======================================================
   GET /service-contracts
   ADMIN: todos
   OTROS: según permisos backend
====================================================== */
export const getServiceContracts = async (): Promise<ServiceContract[]> => {
  const { data } = await http.get<ApiResponse<ServiceContract[]>>(
    '/service-contracts',
  );

  return data.data;
};

/* ======================================================
   GET /service-contracts/client/:rfc
   Contratos por cliente (activos e inactivos)
====================================================== */
export const getServiceContractsByClient = async (
  rfc: string,
): Promise<ServiceContract[]> => {
  const { data } = await http.get<ApiResponse<ServiceContract[]>>(
    `/service-contracts/client/${rfc}`,
  );

  return data.data;
};

/* ======================================================
   GET /service-contracts/:id
====================================================== */
export const getServiceContractById = async (
  id: number,
): Promise<ServiceContract> => {
  const { data } = await http.get<ApiResponse<ServiceContract>>(
    `/service-contracts/${id}`,
  );

  return data.data;
};

/* ======================================================
   POST /service-contracts
   CREATE (ADMIN)
====================================================== */
export const createServiceContract = async (
  payload: CreateServiceContractPayload,
): Promise<ServiceContract> => {
  const { data } = await http.post<ApiResponse<ServiceContract>>(
    '/service-contracts',
    payload,
  );

  return data.data;
};

/* ======================================================
   PATCH /service-contracts/:id
   UPDATE (ADMIN)
====================================================== */
export const updateServiceContract = async (
  id: number,
  payload: UpdateServiceContractPayload,
): Promise<ServiceContract> => {
  const { data } = await http.patch<ApiResponse<ServiceContract>>(
    `/service-contracts/${id}`,
    payload,
  );

  return data.data;
};

/* ======================================================
   PATCH /service-contracts/:id/deactivate
   DEACTIVATE (ADMIN)
====================================================== */
export const deactivateServiceContract = async (
  id: number,
): Promise<ServiceContract> => {
  const { data } = await http.patch<ApiResponse<ServiceContract>>(
    `/service-contracts/${id}/deactivate`,
  );

  return data.data;
};

/* ======================================================
   PATCH /service-contracts/:id/activate
   ACTIVATE (ADMIN)
====================================================== */
export const activateServiceContract = async (
  id: number,
): Promise<ServiceContract> => {
  const { data } = await http.patch<ApiResponse<ServiceContract>>(
    `/service-contracts/${id}/activate`,
  );

  return data.data;
};
