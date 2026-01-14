import type {
  TicketStatus,
  TicketSource,
  ImpactLevel,
} from '../enums';

import type { Client } from '../clients-types/clients.types';
import type { ServiceContract } from '../service-contract-types/service-contract.types';
import type { User } from '../user.types';
import type { TicketHistory } from '../ticket-history-types/ticket-history-ui.types';

export interface Ticket {
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
  clientRfc: string;
  client: Client;

  serviceContractId: number;
  serviceContract: ServiceContract;

  // =========================
  // INFORMACIÓN GENERAL
  // =========================
  requestedBy: string | null;
  contactInfo: string | null;

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
  createdById: number | null;
  createdBy: User | null;

  closedById: number | null;
  closedBy: User | null;

  cancelledById: number | null;
  cancelledBy: User | null;

  // =========================
  // AUDITORÍA
  // =========================
  history: TicketHistory[];
}
