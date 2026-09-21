import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ErrorMessage = ({
  title = 'Ha ocurrido un problema',
  message = 'No se pudieron obtener los datos de la partida. Por favor verifica tu conexión.',
  onRetry,
  retryText = 'Reintentar'
}) => {
  return (
    <div className="error-card" role="alert">
      <div className="error-icon-wrapper">
        <AlertTriangle size={36} className="error-icon" />
      </div>

      <h3 className="error-title">{title}</h3>
      <p className="error-description">{message}</p>

      <div className="error-actions">
        {onRetry && (
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={18} />
            <span>{retryText}</span>
          </button>
        )}

        <Link to="/" className="btn btn-secondary">
          <Home size={18} />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
};
