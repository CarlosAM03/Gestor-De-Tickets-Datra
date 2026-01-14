import { createContext } from 'react';
import type { AuthUser } from '@/types/auth.types';

/**
 * Estados explícitos de autenticación
 * Fuente única de verdad para guards y UI
 */
export type AuthStatus =
  | 'checking'
  | 'authenticated'
  | 'unauthenticated';

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Contexto de autenticación
 * Se inicializa como undefined para forzar uso correcto
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
