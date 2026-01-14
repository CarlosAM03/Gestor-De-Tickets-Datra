// ================================
// DTOs — Ticket History (HTTP)
// Dominio congelado v2.0.0
// ================================

import type {
  TicketEventType,
  TicketStatus,
} from '../enums';

/* =====================================================
   METADATA (DISCRIMINATED)
===================================================== */

export interface TicketHistoryBaseMetadataDTO {
  version: 'v2';
}

/**
 * CREATED
 */
export interface TicketCreatedMetadataDTO
  extends TicketHistoryBaseMetadataDTO {
  requestedBy?: string | null;
  contactInfo?: string | null;
  initialFindings?: string | null;
  probableRootCause?: string | null;
}

/**
 * UPDATED
 */
export interface TicketUpdatedMetadataDTO
  extends TicketHistoryBaseMetadataDTO {
  eventLocation?: string | null;
  estimatedStart?: string | null;
  initialFindings?: string | null;
  probableRootCause?: string | null;
  actionsTaken?: string | null;
  additionalNotes?: string | null;
  correctiveAction?: boolean | null;
}

/**
 * CLOSED
 */
export interface TicketClosedMetadataDTO
  extends TicketHistoryBaseMetadataDTO {
  serviceStatus?: string | null;
  closedAt: string;
}

/**
 * CANCELLED
 * (metadata mínima, razón suele venir en notes)
 */
export interface TicketCancelledMetadataDTO
  extends TicketHistoryBaseMetadataDTO {
  reason?: string | null;
}

/* =====================================================
   METADATA UNION
===================================================== */

export type TicketHistoryMetadataDTO =
  | TicketCreatedMetadataDTO
  | TicketUpdatedMetadataDTO
  | TicketClosedMetadataDTO
  | TicketCancelledMetadataDTO;

/* =====================================================
   USER REDUCIDO
===================================================== */

export interface TicketHistoryUserDTO {
  id: number;
  name: string;
  email: string;
}

/* =====================================================
   HISTORY EVENT DTO
===================================================== */

export interface TicketHistoryResponseDTO {
  id: number;

  eventType: TicketEventType;

  fromStatus: TicketStatus | null;
  toStatus: TicketStatus | null;

  performedBy: TicketHistoryUserDTO | null;

  metadata: TicketHistoryMetadataDTO | null;

  createdAt: string;
}
