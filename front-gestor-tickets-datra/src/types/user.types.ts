import type { UserRole } from './enums';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;

  deactivatedAt: string | null;

  createdAt: string;
  updatedAt: string;
}
