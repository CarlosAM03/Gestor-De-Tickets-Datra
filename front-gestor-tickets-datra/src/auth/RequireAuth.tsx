import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function RequireAuth() {
  const { token } = useAuth();

  // No hay sesión
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Sesión válida
  return <Outlet />;
}
