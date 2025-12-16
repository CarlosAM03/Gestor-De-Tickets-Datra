export type Role = "ADMIN" | "INGENIERO" | "TECNICO";

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
    closeTicket: false,
    requestDelete: false,
    approveDelete: true,
    viewMetrics: true,
    manageUsers: true
  },
  INGENIERO: {
    viewAllTickets: true,
    createTicket: true,
    editTicket: true,
    closeTicket: true,
    requestDelete: true,
    approveDelete: false,
    viewMetrics: true,
    manageUsers: false
  },
  TECNICO: {
    viewAllTickets: true,
    createTicket: true,
    editTicket: true,
    closeTicket: true,
    requestDelete: true,
    approveDelete: false,
    viewMetrics: false,
    manageUsers: false
  }
};
