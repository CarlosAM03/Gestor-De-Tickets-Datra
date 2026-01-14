import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  // Aún no sabemos si está autenticado o no
  if (status === 'checking') {
    return null; // luego <SplashScreen />
  }

  // No autenticado
  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Autenticado
  return <Outlet />;
}
