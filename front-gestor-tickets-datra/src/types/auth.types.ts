import type { UserRole } from './enums';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}


/**
 * Respuesta de login
 */
export interface LoginResponse {
  message: string;
  access_token: string;
  expires_in: string;
  user: AuthUser;
}

