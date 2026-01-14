import type { User } from './user.types';

/**
 * Usuario autenticado
 * (idéntico al User expuesto por backend)
 */
export type AuthUser = User;

/**
 * Respuesta de login
 */
export interface LoginResponse {
  access_token: string;
  expires_in?: string;
  user: AuthUser;
}
