import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: JSX.Element; requiredRole?: string }> = ({ children, requiredRole }) => {
  const auth = React.useContext(AuthContext);
  if (!auth) return <Navigate to="/login" replace />;

  if (!auth.user) return <Navigate to="/login" replace />;

  if (requiredRole && auth.user.role !== requiredRole) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
