import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AppRoutes } from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';

export const App = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const isLoginPage = location.pathname === '/';
  const isAdminArea = isAdmin || location.pathname.startsWith('/admin');

  return (
    <div className={`app-shell ${isLoginPage ? 'login-shell' : ''} ${isAdminArea ? 'admin-shell' : ''}`}>
      {/* Barra de navegación superior sólo para jugadores fuera del login.
          El administrador tiene exclusivamente su panel lateral izquierdo */}
      {!isLoginPage && isAuthenticated && !isAdminArea && <Navigation />}

      {/* Contenido principal orquestado por las rutas */}
      <main className={`main-viewport ${isLoginPage ? 'login-viewport' : ''} ${isAdminArea ? 'admin-viewport' : ''}`}>
        <AppRoutes />
      </main>

      {/* Pie de página sólo en el área de jugadores fuera del login */}
      {!isLoginPage && isAuthenticated && !isAdminArea && (
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
      )}
    </div>
  );
};

export default App;

