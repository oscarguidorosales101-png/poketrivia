import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

/**
 * Guardián de rutas para proteger accesos según autenticación y roles:
 * - Si no está autenticado: 401 -> Redirige al login (/)
 * - Si está autenticado pero requiere rol ADMIN y el usuario es PLAYER: 403 -> Redirige a /403
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const user = getCurrentUser();

  // 401: No autenticado
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 403: Autenticado pero sin permisos de administrador
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/403" state={{ deniedRole: requiredRole, userRole: user.role }} replace />;
  }

  return children;
};
