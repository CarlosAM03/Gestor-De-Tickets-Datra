// ================================
// DTOs — Ticket HTTP Contract
// Dominio congelado v2.0.0
// ================================

import type {
  TicketStatus,
  TicketSource,
  ImpactLevel,
  TicketEventType,
} from '../enums';

/* =====================================================
   REQUEST DTOs
===================================================== */

/**
 * Crear ticket
 * POST /tickets
 */
export interface CreateTicketDTO {
  // =========================
  // CLIENTE / SERVICIO
  // =========================
  clientRfc: string;
  serviceContractId: number;

  // =========================
  // INFORMACIÓN GENERAL
  // =========================
  requestedBy?: string;
  contactInfo?: string;

  // =========================
  // INCIDENTE
  // =========================
  impactLevel: ImpactLevel;
  problemDescription: string;
  eventLocation?: string;
  estimatedStart?: string;

  // =========================
  // DIAGNÓSTICO
  // =========================
  initialFindings?: string;
  probableRootCause?: string;

  // =========================
  // CIERRE (editable luego)
  // =========================
  actionsTaken?: string;
  additionalNotes?: string;
  correctiveAction?: boolean;
}

/**
 * Actualizar ticket
 * PATCH /tickets/:id
 */
export type UpdateTicketDTO = Partial<CreateTicketDTO>;

/**
 * Resolver ticket
 * POST /tickets/:id/resolve
 */
export interface ResolveTicketDTO {
  actionsTaken?: string;
  probableRootCause?: string;
}

/**
 * Cerrar ticket
 * POST /tickets/:id/close
 */
export interface CloseTicketDTO {
  serviceStatus?: string;
}

/**
 * Cancelar ticket
 * POST /tickets/:id/cancel
 */
export interface CancelTicketDTO {
  reason: string;
}

/* =====================================================
   RESPONSE DTOs
===================================================== */

/**
 * Usuario reducido (respuesta)
 */
export interface TicketUserDTO {
  id: number;
  name: string;
  email: string;
}

/**
 * Cliente reducido (respuesta)
 */
export interface TicketClientDTO {
  rfc: string;
  clientNumber: string;
  businessName?: string | null;
}

/**
 * Contrato reducido (respuesta)
 */
export interface TicketServiceContractDTO {
  id: number;
  name: string;
  priorityLevel: number;
  slaHours: number;
}

/**
 * Ticket (respuesta completa)
 */
export interface TicketResponseDTO {
  id: number;
  code: string;

  // =========================
  // CICLO DE VIDA
  // =========================
  status: TicketStatus;
  source: TicketSource;

  createdAt: string;
  openedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  cancelledAt: string | null;

  // =========================
  // CLIENTE / SERVICIO
  // =========================
  client: TicketClientDTO;
  serviceContract: TicketServiceContractDTO;

  // =========================
  // INCIDENTE
  // =========================
  impactLevel: ImpactLevel;
  problemDescription: string;
  eventLocation: string | null;
  estimatedStart: string | null;

  // =========================
  // DIAGNÓSTICO
  // =========================
  initialFindings: string | null;
  probableRootCause: string | null;

  // =========================
  // CIERRE
  // =========================
  actionsTaken: string | null;
  serviceStatus: string | null;
  additionalNotes: string | null;
  correctiveAction: boolean | null;

  // =========================
  // USUARIOS
  // =========================
  createdBy: TicketUserDTO | null;
  closedBy: TicketUserDTO | null;
  cancelledBy: TicketUserDTO | null;

  // =========================
  // HISTORIAL
  // =========================
  history: TicketHistoryResponseDTO[];
}

/**
 * Lista de tickets
 * GET /tickets
 */
export interface TicketListResponseDTO {
  data: TicketResponseDTO[];
}

/* =====================================================
   HISTORY DTOs
===================================================== */

/**
 * Metadata base
 */
export interface TicketHistoryBaseMetadataDTO {
  version: 'v2';
}

/**
 * Evento de historial
 */
export interface TicketHistoryResponseDTO {
  id: number;
  eventType: TicketEventType;

  fromStatus: TicketStatus | null;
  toStatus: TicketStatus | null;

  performedBy: TicketUserDTO | null;

  metadata: TicketHistoryBaseMetadataDTO | null;
  createdAt: string;
}
