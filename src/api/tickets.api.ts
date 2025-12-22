import http from './http';
import type {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketStatus,
} from '@/types/ticket.types';

/**
 * Listar tickets
 * scope=mine | all
 */
export const getTickets = async (params?: {
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  from?: string;
  to?: string;
  search?: string;
}) => {
  const { data } = await http.get<Ticket[]>('/tickets', { params });
  return data;
};

/**
 * Obtener ticket por ID
 */
export const getTicketById = async (id: number) => {
  const { data } = await http.get<Ticket>(`/tickets/${id}`);
  return data;
};

/**
 * Crear ticket
 */
export const createTicket = async (payload: CreateTicketDto) => {
  const { data } = await http.post<Ticket>('/tickets', payload);
  return data;
};

/**
 * Actualizar ticket
 */
export const updateTicket = async (
  id: number,
  payload: UpdateTicketDto,
) => {
  const { data } = await http.patch<Ticket>(
    `/tickets/${id}`,
    payload,
  );
  return data;
};

/**
 * Cambiar estatus del ticket
 */
export const updateTicketStatus = async (
  id: number,
  status: TicketStatus,
) => {
  const { data } = await http.patch<Ticket>(
    `/tickets/${id}/status`,
    { status },
  );
  return data;
};

/**
 * Solicitar eliminación de ticket
 */
export const requestTicketDeletion = async (id: number) => {
  const { data } = await http.delete(`/tickets/${id}`);
  return data;
};
