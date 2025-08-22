import React from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = authApi.isAuthenticated();
  const user = authApi.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}