import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Hook de acceso al contexto de autenticación
 * Garantiza uso exclusivo dentro de AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
