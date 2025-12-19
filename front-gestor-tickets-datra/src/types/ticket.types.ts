/**
 * Estados posibles de un ticket
 * Debe coincidir con el enum del backend (Prisma / Nest)
 */
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

/**
 * Prioridad del ticket
 */
export type TicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

/**
 * Ticket base (entidad principal)
 */
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;

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

/**
 * DTO para crear ticket
 * Coincide con CreateTicketDto del backend
 */
export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
}

/**
 * DTO para actualizar ticket
 * Todos los campos opcionales
 */
export interface UpdateTicketDto {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedToId?: number | null;
}
