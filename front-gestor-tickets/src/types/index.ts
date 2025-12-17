// src/types/index.ts
export type Role = 'ADMIN' | 'INGENIERO' | 'TECNICO';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role; // Ya no es opcional
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ticket {
  id: number;
  code: string;
  openedAt: string;
  requestedBy?: string | null;
  contact?: string | null;
  clientType?: string | null;
  serviceAffected?: string | null;
  problemDesc?: string | null;
  eventLocation?: string | null;
  estimatedStart?: string | null;
  impactLevel?: string | null;
  initialFindings?: string | null;
  probableRootCause?: string | null;
  actionsTaken?: string | null;
  closedAt?: string | null;
  serviceStatus?: string | null;
  additionalNotes?: string | null;
  correctiveAction?: boolean | null;
  createdById?: number | null;
  preliminaryById?: number | null;
  closingTechnicianId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}