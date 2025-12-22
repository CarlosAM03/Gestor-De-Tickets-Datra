/* =====================================================
   ENUMS / TIPOS BASE
===================================================== */

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFO';

export type ClientType =
  | 'INTERNO'
  | 'EXTERNO';

/* =====================================================
   MODELO PRINCIPAL: Ticket
===================================================== */

export interface Ticket {
  id: number;
  code: string;

  status: TicketStatus;

  impactLevel?: ImpactLevel | null;
  clientType?: ClientType | null;

  requestedBy?: string | null;
  contact?: string | null;
  serviceAffected?: string | null;
  problemDesc?: string | null;

  eventLocation?: string | null;
  initialFindings?: string | null;
  probableRootCause?: string | null;
  actionsTaken?: string | null;
  additionalNotes?: string | null;

  correctiveAction?: boolean | null;

  openedAt: string;
  estimatedStart?: string | null;
  closedAt?: string | null;

  deleteRequested: boolean;

  createdAt: string;
  updatedAt: string;

  createdBy: {
    id: number;
    name: string;
    email: string;
  };

  assignedTo?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

/* =====================================================
   DTO: Crear Ticket
   (ALINEADO A CreateTicketDto BACKEND)
===================================================== */

export interface CreateTicketDto {
  openedAt?: string;

  requestedBy?: string;
  contact?: string;
  clientType?: ClientType;

  serviceAffected?: string;
  problemDesc?: string;
  eventLocation?: string;

  estimatedStart?: string;

  impactLevel?: ImpactLevel;

  initialFindings?: string;
  probableRootCause?: string;
  actionsTaken?: string;

  closedAt?: string;

  additionalNotes?: string;
  correctiveAction?: boolean;
}

/* =====================================================
   DTO: Actualizar Ticket
   (PATCH parcial)
===================================================== */

export type UpdateTicketDto = Partial<CreateTicketDto>;

/* =====================================================
   PARAMS DE LISTADO (opcional, recomendado)
===================================================== */

export interface GetTicketsParams {
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  impactLevel?: ImpactLevel;
  from?: string;
  to?: string;
  search?: string;
}
