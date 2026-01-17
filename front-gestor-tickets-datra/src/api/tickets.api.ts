// ================================
// Tickets API — Dominio real v2.0.0
// ================================

import http from './http';
import type { Ticket } from '@/types/ticket-types/ticket.types';
import type { ImpactLevel, TicketStatus } from '@/types/enums';

// ======================================================
// QUERY PARAMS — GET /tickets
// ======================================================

export interface GetTicketsParams {
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  impact?: ImpactLevel;
  code?: string;
  rfc?: string;
  from?: string;
  to?: string;
  search?: string;
}

// ======================================================
// CREATE — POST /tickets
// ======================================================

export interface CreateTicketPayload {
  // =========================
  // CLIENTE / SERVICIO
  // =========================
  clientRfc: string;
  serviceContractId: number;

  // =========================
  // INCIDENTE
  // =========================
  impactLevel: ImpactLevel;
  problemDescription: string;
  eventLocation?: string;
  estimatedStart?: string;

  // =========================
  // INFORMACIÓN GENERAL
  // =========================
  requestedBy?: string;
  contactInfo?: string;
}

// ======================================================
// UPDATE INFO — PATCH /tickets/:id
// (NO cambia estado)
// ======================================================

export interface UpdateTicketPayload {
  requestedBy?: string;
  contactInfo?: string;

  impactLevel?: ImpactLevel;
  problemDescription?: string;
  eventLocation?: string;
  estimatedStart?: string;

  initialFindings?: string;
  probableRootCause?: string;

  actionsTaken?: string;
  additionalNotes?: string;
  correctiveAction?: boolean;
}

// ======================================================
// API CALLS
// ======================================================

export const getTickets = async (
  params?: GetTicketsParams,
): Promise<Ticket[]> => {
  const response = await http.get('/tickets', { params });

  // Normalización defensiva
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  return [];
};


export const getTicketById = async (id: number): Promise<Ticket> => {
  const { data } = await http.get<Ticket>(`/tickets/${id}`);
  return data;
};

export const createTicket = async (
  payload: CreateTicketPayload,
): Promise<Ticket> => {
  const { data } = await http.post<Ticket>('/tickets', payload);
  return data;
};

/**
 * Update de información (NO STATUS)
 * Backend valida estados ilegales
 */
export const updateTicket = async (
  id: number,
  payload: UpdateTicketPayload,
): Promise<Ticket> => {
  const { data } = await http.patch<Ticket>(
    `/tickets/${id}`,
    payload,
  );
  return data;
};

/**
 * =========================
 * ACCIONES DE DOMINIO
 * =========================
 */

/**
 * OPEN → RESOLVED
 */
export const resolveTicket = async (id: number): Promise<Ticket> => {
  const { data } = await http.patch<Ticket>(
    `/tickets/${id}/resolve`,
  );
  return data;
};

/**
 * RESOLVED → CLOSED
 */
export const closeTicket = async (id: number): Promise<Ticket> => {
  const { data } = await http.patch<Ticket>(
    `/tickets/${id}/close`,
  );
  return data;
};

/**
 * OPEN / RESOLVED → CANCELLED
 * reason obligatorio (backend)
 */
export const cancelTicket = async (
  id: number,
  reason: string,
): Promise<Ticket> => {
  const { data } = await http.patch<Ticket>(
    `/tickets/${id}/cancel`,
    { reason },
  );
  return data;
};
