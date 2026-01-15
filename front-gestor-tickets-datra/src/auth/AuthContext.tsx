import { createContext } from 'react';
import type { AuthUser } from '@/types/auth.types';

/**
 * Estados explícitos de autenticación
 * Fuente única de verdad para guards, layout y UI
 */
export type AuthStatus =
  | 'checking'          // Verificando sesión (bootstrap)
  | 'authenticated'    // Sesión válida
  | 'unauthenticated'; // No autenticado

/**
 * Contrato del contexto de autenticación
 * No incluye lógica de navegación
 */
export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Contexto de autenticación
 * Se inicializa como undefined para forzar uso exclusivo
 * mediante el hook useAuth()
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
