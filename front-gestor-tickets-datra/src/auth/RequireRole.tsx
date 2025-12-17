import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { UserRole } from '@/types/auth.types';
import { JSX } from 'react';

interface Props {
  allowedRoles: UserRole[];
  children: JSX.Element;
}

export function RequireRole({ allowedRoles, children }: Props) {
  const { user, token } = useAuth();

  // No autenticado → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero sin permisos → unauthorized
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
