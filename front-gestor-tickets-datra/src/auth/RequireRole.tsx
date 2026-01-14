import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { UserRole } from '@/types/enums';
import type { ReactNode } from 'react';

interface Props {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RequireRole({ allowedRoles, children }: Props) {
  const { user } = useAuth();

  // Auth ya fue validado por RequireAuth
  // Si no hay usuario aún, no renderizamos nada
  if (!user) {
    return null;
  }

  // Usuario autenticado pero sin permisos
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
