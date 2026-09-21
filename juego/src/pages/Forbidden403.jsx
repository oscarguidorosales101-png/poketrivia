import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Gamepad2 } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

export const Forbidden403 = () => {
  const user = getCurrentUser();

  return (
    <div className="page-container page-error-http">
      <div className="http-error-card">
        <div className="http-badge badge-403">
          <ShieldAlert size={28} />
          <span>Error 403 — Acceso Prohibido</span>
        </div>

        <h1 className="http-title">Área Restringida a Administradores</h1>
        <p className="http-message">
          Tu cuenta actual (<strong>{user?.name || user?.username || 'Entrenador'}</strong>) tiene el rol de{' '}
          <span className="role-tag-player">PLAYER</span>. No posees las credenciales ni la autorización de{' '}
          <span className="role-tag-admin">ADMIN</span> requeridas para acceder al panel de control administrativo.
        </p>

        <div className="http-actions">
          <Link to="/jugador" className="btn btn-primary">
            <Gamepad2 size={18} />
            <span>Volver a Mi Panel de Jugador</span>
          </Link>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={18} />
            <span>Iniciar Sesión con Otra Cuenta</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
