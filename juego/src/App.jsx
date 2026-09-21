import React from 'react';
import { Navigation } from './components/Navigation';
import { AppRoutes } from './routes/AppRoutes';

export const App = () => {
  return (
    <div className="app-shell">
      {/* Barra de navegación global */}
      <Navigation />

      {/* Contenido principal orquestado por las rutas */}
      <main className="main-viewport">
        <AppRoutes />
      </main>

      {/* Pie de página con créditos de PokeAPI y Quiz */}
      <footer className="site-footer">
        <div className="footer-content">
          <p>
            PokéTrivia Challenge — Quiz #5 Desarrollo Web Frontend
          </p>
          <p className="footer-credits">
            Datos provistos por <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">PokeAPI</a>.
            Automatizado con <a href="https://n8n.io" target="_blank" rel="noopener noreferrer">n8n</a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
