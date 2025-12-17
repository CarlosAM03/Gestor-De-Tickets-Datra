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
   Colores para Bootstrap Badges
   Usa variantes de Bootstrap para que funcione con <Badge bg="...">
========================= */

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  ABIERTO: 'danger',      // rojo
  EN_PROGRESO: 'warning',  // naranja/amarillo
  EN_ESPERA: 'info',       // azul claro
  RESUELTO: 'success',     // verde
  CERRADO: 'primary',      // azul
  CANCELADO: 'secondary',  // gris
};

/* =========================
   Colores en HEXADECIMAL (para uso personalizado)
========================= */

export const TICKET_STATUS_HEX: Record<TicketStatus, string> = {
  ABIERTO: '#dc3545',      // rojo
  EN_PROGRESO: '#fd7e14',  // naranja
  EN_ESPERA: '#ffc107',    // amarillo
  RESUELTO: '#28a745',     // verde
  CERRADO: '#007bff',      // azul
  CANCELADO: '#6c757d',    // gris
};

// Exports adicionales para compatibilidad con imports existentes
export const STATUS_LABELS = TICKET_STATUS;
export const STATUS_COLORS = TICKET_STATUS_COLORS;