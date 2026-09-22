import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn, Globe } from 'lucide-react';

export const Unauthorized401 = () => {
  return (
    <div className="page-container page-error-http">
      <div className="http-error-card">
        <div className="http-badge badge-401">
          <Lock size={26} />
          <span>Error 401 — Acceso No Autenticado</span>
        </div>

        <h1 className="http-title">Se Requiere Inicio de Sesión</h1>
        <p className="http-message">
          Para ingresar a la arena de supervivencia infinita, registrar puntuaciones y consultar tu
          perfil de entrenador, es obligatorio identificarte previamente.
        </p>

        <div className="http-actions">
          <Link to="/" className="btn btn-primary">
            <LogIn size={18} />
            <span>Iniciar Sesión</span>
          </Link>
          <Link to="/clasificacion" className="btn btn-secondary">
            <Globe size={18} />
            <span>Ver Clasificación Mundial</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
