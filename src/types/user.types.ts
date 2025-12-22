/**
 * Roles soportados por el sistema
 * (alineados con Prisma / backend)
 */
export type UserRole = 'ADMIN' | 'INGENIERO' | 'TECNICO';

/**
 * Usuario base del sistema
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
