import React from 'react';

export const LoadingState = ({ message = 'Cargando datos de PokeAPI...' }) => {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="pokeball-spinner">
        <div className="pokeball-top"></div>
        <div className="pokeball-center">
          <div className="pokeball-button"></div>
        </div>
        <div className="pokeball-bottom"></div>
      </div>
      <p className="loading-text">{message}</p>
      <span className="loading-subtext">Consultando la Pokédex oficial...</span>
    </div>
  );
};
