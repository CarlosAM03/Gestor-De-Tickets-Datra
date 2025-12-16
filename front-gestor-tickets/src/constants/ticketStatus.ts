// src/constants/ticketStatus.ts

export const TICKET_STATUS = {
  ABIERTO: 'Abierto',
  EN_PROGRESO: 'En progreso',
  EN_ESPERA: 'En espera',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
  CANCELADO: 'Cancelado',
} as const;

export type TicketStatus = keyof typeof TICKET_STATUS;

/* =========================
   Colores para UI (Bootstrap)
========================= */

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  ABIERTO: 'danger',       // rojo
  EN_PROGRESO: 'warning',  // naranja
  EN_ESPERA: 'warning',    // amarillo (afinamos luego)
  RESUELTO: 'success',     // verde
  CERRADO: 'primary',      // azul
  CANCELADO: 'secondary',  // gris
};
