import type { User } from './user.types';

/**
 * Usuario autenticado
 * (por ahora igual a User, pero puede extenderse)
 */
export type AuthUser = User;

/**
 * Respuesta de login
 */
export interface LoginResponse {
  access_token: string;
  expires_in: string;
}
