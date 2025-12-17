import type { UserRole } from './auth.types';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
