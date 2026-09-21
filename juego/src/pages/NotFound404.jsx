import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, Gamepad2 } from 'lucide-react';

export const NotFound404 = () => {
  return (
    <div className="page-container page-error-http">
      <div className="http-error-card">
        <div className="http-badge badge-404">
          <HelpCircle size={28} />
          <span>Error 404 — Ruta No Encontrada</span>
        </div>

        <h1 className="http-title">¡Un Pokémon Salvaje Bloqueó el Camino!</h1>
        <p className="http-message">
          La ruta que intentas visitar no existe o fue movida en la Pokédex del sistema. Revisa la URL
          o regresa a la zona segura.
        </p>

        <div className="http-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Ir al Inicio</span>
          </Link>
          <Link to="/jugador" className="btn btn-secondary">
            <Gamepad2 size={18} />
            <span>Ir al Panel de Juego</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
