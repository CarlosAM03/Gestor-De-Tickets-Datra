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
   CLIENTE
   (Embebido en Ticket – alineado al backend actual)
===================================================== */

export interface TicketClient {
  rfc: string;
  companyName: string;
  businessName?: string;
  location?: string;
}

/*
  ⚠️ NOTA DE DISEÑO:
  - Hoy el cliente SOLO existe embebido en Ticket
  - Este tipo permite en el futuro:
      - Client
      - ClientList
      - ClientView
    sin romper contratos actuales
*/

/* =====================================================
   MODELO PRINCIPAL: Ticket
   (Respuesta API Backend)
===================================================== */

export interface Ticket {
  id: number;
  code: string;

  status: TicketStatus;

  impactLevel?: ImpactLevel | null;
  clientType?: ClientType | null;

  requestedBy?: string | null;
  contact?: string | null;

  /* =========================
     Cliente embebido
  ========================= */
  client?: TicketClient | null;

  /* =========================
     Incidente
  ========================= */
  serviceAffected?: string | null;
  problemDesc?: string | null;
  eventLocation?: string | null;

  /* =========================
     Diagnóstico
  ========================= */
  initialFindings?: string | null;
  probableRootCause?: string | null;

  /* =========================
     Cierre
  ========================= */
  actionsTaken?: string | null;
  additionalNotes?: string | null;
  correctiveAction?: boolean | null;

  /* =========================
     Fechas
  ========================= */
  openedAt: string;
  estimatedStart?: string | null;
  closedAt?: string | null;

  /* =========================
     Control
  ========================= */
  deleteRequested: boolean;

  createdAt: string;
  updatedAt: string;

  /* =========================
     Relaciones
  ========================= */
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
   (ALINEADO EXACTO A CreateTicketDto BACKEND)
===================================================== */

export interface CreateTicketDto {
  openedAt?: string;

  requestedBy?: string;
  contact?: string;
  clientType?: ClientType;

  /* =========================
     Cliente embebido
  ========================= */
  client?: TicketClient;

  /* =========================
     Incidente
  ========================= */
  serviceAffected?: string;
  problemDesc?: string;
  eventLocation?: string;
  estimatedStart?: string;
  impactLevel?: ImpactLevel;

  /* =========================
     Diagnóstico
  ========================= */
  initialFindings?: string;
  probableRootCause?: string;

  /* =========================
     Cierre
  ========================= */
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
   FORM VALUES
   (El formulario usa el mismo contrato que Create)
===================================================== */

export type TicketFormValues = CreateTicketDto;

/* =====================================================
   PARAMS DE LISTADO
===================================================== */

export interface GetTicketsParams {
  scope?: 'mine' | 'all';
  status?: TicketStatus;
  impactLevel?: ImpactLevel;
  from?: string;
  to?: string;
  search?: string;
}
