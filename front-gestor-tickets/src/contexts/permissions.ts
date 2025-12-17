// src/contexts/permissions.ts
import type { TicketStatus } from '../constants/ticketStatus';

export type Role = 'ADMIN' | 'INGENIERO' | 'TECNICO';

export type Permissions = {
  viewAllTickets: boolean;
  createTicket: boolean;
  editTicket: boolean;
  closeTicket: boolean;
  requestDelete: boolean;
  approveDelete: boolean;
  viewMetrics: boolean;
  manageUsers: boolean;
};

export const PERMISSIONS: Record<Role, Permissions> = {
  ADMIN: {
    viewAllTickets: true,
    createTicket: true,
    editTicket: true,
    closeTicket: true,
    requestDelete: false,
    approveDelete: true,
    viewMetrics: true,
    manageUsers: true,
  },
  INGENIERO: {
    viewAllTickets: true,
    createTicket: true,
    editTicket: true,
    closeTicket: true,
    requestDelete: false,
    approveDelete: true,
    viewMetrics: true,
    manageUsers: false,
  },
  TECNICO: {
    viewAllTickets: true,
    createTicket: true,
    editTicket: true,
    closeTicket: false,
    requestDelete: true,
    approveDelete: false,
    viewMetrics: false,
    manageUsers: false,
  },
};

export const STATUS_BY_ROLE: Record<Role, TicketStatus[]> = {
  ADMIN: [
    'ABIERTO',
    'EN_PROGRESO',
    'EN_ESPERA',
    'RESUELTO',
    'CERRADO',
    'CANCELADO',
  ],
  INGENIERO: [
    'ABIERTO',
    'EN_PROGRESO',
    'EN_ESPERA',
    'RESUELTO',
    'CERRADO',
  ],
  TECNICO: [
    'ABIERTO',
    'EN_PROGRESO',
    'EN_ESPERA',
    'RESUELTO',
  ],
};

export const getAllowedStatusesByRole = (role: Role): TicketStatus[] => {
  return STATUS_BY_ROLE[role] ?? [];
};

export const hasPermission = (role: Role | undefined, permission: keyof Permissions): boolean => {
  if (!role) return false;
  return PERMISSIONS[role]?.[permission] ?? false;
};

export const canChangeStatus = (
  role: Role | undefined,
  newStatus: TicketStatus
): boolean => {
  if (!role) return false;
  const allowedStatuses = getAllowedStatusesByRole(role);
  return allowedStatuses.includes(newStatus);
};

export const getRoleLabel = (role: Role): string => {
  const labels: Record<Role, string> = {
    ADMIN: 'Administrador',
    INGENIERO: 'Ingeniero',
    TECNICO: 'Técnico',
  };
  return labels[role];
};

export const getRoleColor = (role: Role): string => {
  const colors: Record<Role, string> = {
    ADMIN: '#6f42c1',
    INGENIERO: '#0d6efd',
    TECNICO: '#20c997',
  };
  return colors[role];
};