import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

export function RequireAuth({ children }: Props) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
