import http from './http';
import type {
  Ticket,
  TicketHistory,
  CreateTicketDto,
  UpdateTicketDto,
  TicketStatus,
  ImpactLevel,
} from '@/types/ticket.types';

/* =====================================================
   LISTADO
===================================================== */
export const getTickets = async (params?: {
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  impact?: ImpactLevel;
  rfc?: string;
  code?: string;
  from?: string;
  to?: string;
  search?: string;
}) => {
  const { data } = await http.get<Ticket[]>('/tickets', { params });
  return data;
};

/* =====================================================
   DETALLE
===================================================== */
export const getTicketById = async (id: number) => {
  const { data } = await http.get<Ticket>(`/tickets/${id}`);
  return data;
};

/* =====================================================
   CREATE
===================================================== */
export const createTicket = async (payload: CreateTicketDto) => {
  const { data } = await http.post<Ticket>('/tickets', payload);
  return data;
};

/* =====================================================
   UPDATE INFO (PATCH)
===================================================== */
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

/* =====================================================
   UPDATE STATUS
===================================================== */
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

/* =====================================================
   REQUEST DELETE (soft delete)
===================================================== */
export const requestTicketDeletion = async (id: number) => {
  const { data } = await http.delete(`/tickets/${id}`);
  return data;
};

/* =====================================================
   ADMIN – LIST DELETE REQUESTS
===================================================== */
export const getDeleteRequests = async () => {
  const { data } = await http.get<Ticket[]>(
    '/tickets/admin/delete-requests',
  );
  return data;
};

/* =====================================================
   ADMIN – APPROVE DELETE
===================================================== */
export const approveDeleteTicket = async (id: number) => {
  const { data } = await http.patch(
    `/tickets/admin/${id}/approve-delete`,
  );
  return data;
};

/* =====================================================
   ADMIN – REJECT DELETE
===================================================== */
export const rejectTicketDeletion = async (id: number) => {
  const { data } = await http.patch(
    `/tickets/admin/${id}/reject-delete`,
  );
  return data;
};

/* =====================================================
   ADMIN – HISTORY
===================================================== */
export const getTicketHistory = async (id: number): Promise<TicketHistory[]> => {
  const { data } = await http.get<TicketHistory[]>(
    `/tickets/${id}/history`,
  );
  return data;
};
