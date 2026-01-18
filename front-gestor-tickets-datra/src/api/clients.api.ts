import http from './http';

import type { Client } from '@/types/clients-types/clients.types';
import type {
  CreateClientPayload,
  UpdateClientPayload,
} from '@/types/clients-types/clients.dto';

/* ================================
   API RESPONSE WRAPPER
================================ */
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* ======================================================
   GET /clients/all
   ADMIN: todos
   TECNICO / INGENIERO: solo activos
====================================================== */
export const getAllClients = async (
  includeInactive = false,
): Promise<Client[]> => {
  const { data } = await http.get<ApiResponse<Client[]>>(
    '/clients/all',
    {
      params: { includeInactive },
    },
  );

  return data.data;
};

/* ======================================================
   GET /clients/search?q=ABC
   Autocomplete (solo activos)
====================================================== */
export const searchClients = async (
  q: string,
): Promise<Client[]> => {
  const { data } = await http.get<ApiResponse<Client[]>>(
    '/clients/search',
    {
      params: { q },
    },
  );

  return data.data;
};

/* ======================================================
   GET /clients/:rfc
====================================================== */
export const getClientByRfc = async (
  rfc: string,
): Promise<Client> => {
  const { data } = await http.get<ApiResponse<Client>>(
    `/clients/${rfc}`,
  );

  return data.data;
};

/* ======================================================
   POST /clients
   ADMIN ONLY
====================================================== */
export const createClient = async (
  payload: CreateClientPayload,
): Promise<Client> => {
  const { data } = await http.post<ApiResponse<Client>>(
    '/clients',
    payload,
  );

  return data.data;
};

/* ======================================================
   PATCH /clients/:rfc
   ADMIN ONLY
====================================================== */
export const updateClient = async (
  rfc: string,
  payload: UpdateClientPayload,
): Promise<Client> => {
  const { data } = await http.patch<ApiResponse<Client>>(
    `/clients/${rfc}`,
    payload,
  );

  return data.data;
};

/* ======================================================
   PATCH /clients/:rfc/activate
   ADMIN ONLY
====================================================== */
export const activateClient = async (
  rfc: string,
): Promise<Client> => {
  const { data } = await http.patch<ApiResponse<Client>>(
    `/clients/${rfc}/activate`,
  );

  return data.data;
};

/* ======================================================
   PATCH /clients/:rfc/deactivate
   ADMIN ONLY
====================================================== */
export const deactivateClient = async (
  rfc: string,
): Promise<Client> => {
  const { data } = await http.patch<ApiResponse<Client>>(
    `/clients/${rfc}/deactivate`,
  );

  return data.data;
};
