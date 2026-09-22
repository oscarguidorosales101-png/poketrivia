import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Guardián de rutas para proteger accesos según autenticación y roles:
 * - Si no está autenticado: 401 -> Redirige a /401
 * - Si está autenticado pero requiere rol ADMIN y el usuario es PLAYER: 403 -> Redirige a /403
 * - Si está autenticado como ADMIN e intenta entrar a vista exclusiva de PLAYER: Redirige a /admin
 */
export const ProtectedRoute = ({ children, requiredRole, allowedRole }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // 401: No autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/401" state={{ from: location }} replace />;
  }

  // 403: Autenticado pero sin permisos de administrador
  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to="/403" state={{ deniedRole: requiredRole, userRole: user.role }} replace />;
  }

  // Un administrador no debe recibir una interfaz de jugador
  if (allowedRole === 'PLAYER' && user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

