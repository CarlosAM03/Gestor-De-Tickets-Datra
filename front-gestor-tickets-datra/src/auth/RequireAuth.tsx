import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Guard de autenticación
 *
 * Responsabilidad:
 * - Bloquear acceso si no hay sesión
 * - NO validar roles
 * - NO hacer redirects imperativos
 * - NO renderizar layout
 *
 * Fuente de verdad: AuthContext
 */
export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  /**
   * Estado intermedio:
   * Aún se está restaurando sesión (bootstrap)
   * No renderizamos nada para evitar parpadeos
   */
  if (status === 'checking') {
    return null; // futuro: <SplashScreen />
  }

  /**
   * Usuario NO autenticado
   * Redirige a login preservando ruta original
   */
  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /**
   * Usuario autenticado
   * Renderiza el árbol protegido
   */
  return <Outlet />;
}
