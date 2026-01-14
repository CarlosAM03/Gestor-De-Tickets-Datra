import http from './http';
import type { Client } from '@/types/clients-types/clients.types';
import type {
  CreateClientPayload,
  UpdateClientPayload,
} from '@/types/clients-types/clients.dto';

// Autocomplete / búsqueda
export const searchClients = async (q: string): Promise<Client[]> => {
  const { data } = await http.get<Client[]>('/clients', {
    params: { q },
  });
  return data;
};

// Obtener cliente por RFC
export const getClientByRfc = async (rfc: string): Promise<Client> => {
  const { data } = await http.get<Client>(`/clients/${rfc}`);
  return data;
};

// Crear cliente (ADMIN)
export const createClient = async (
  payload: CreateClientPayload,
): Promise<Client> => {
  const { data } = await http.post<Client>('/clients', payload);
  return data;
};

// Actualizar cliente (ADMIN)
export const updateClient = async (
  rfc: string,
  payload: UpdateClientPayload,
): Promise<Client> => {
  const { data } = await http.patch<Client>(`/clients/${rfc}`, payload);
  return data;
};

// Activar / desactivar
export const activateClient = async (rfc: string): Promise<Client> => {
  const { data } = await http.patch<Client>(`/clients/${rfc}/activate`);
  return data;
};

export const deactivateClient = async (rfc: string): Promise<Client> => {
  const { data } = await http.patch<Client>(`/clients/${rfc}/deactivate`);
  return data;
};
