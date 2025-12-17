import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { JSX } from 'react/jsx-runtime';

interface Props {
  allowedRoles: Array<'ADMIN' | 'INGENIERO' | 'TECNICO'>;
  children: JSX.Element;
}

export function RequireRole({ allowedRoles, children }: Props) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
