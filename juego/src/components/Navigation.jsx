import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, HelpCircle, User, Shield, LogOut, LogIn, Award, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navigation = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <Link to={isAuthenticated ? '/jugador' : '/'} className="brand-logo">
            <div className="pokeball-icon-wrapper">
              <span className="pokeball-icon"></span>
            </div>
            <div className="brand-text">
              <span className="brand-title">PokéTrivia</span>
              <span className="brand-subtitle">Survival Master</span>
            </div>
          </Link>

          <nav className="main-nav">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/jugador"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Gamepad2 className="nav-icon" size={18} />
                  <span>Jugar</span>
                </NavLink>

                <NavLink
                  to="/clasificacion"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Globe className="nav-icon" size={18} />
                  <span>Clasificación</span>
                </NavLink>

                <NavLink
                  to="/resultados"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Award className="nav-icon" size={18} />
                  <span>Historial</span>
                </NavLink>

                <NavLink
                  to="/perfil"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <User className="nav-icon" size={18} />
                  <span>Perfil</span>
                </NavLink>

                <NavLink
                  to="/instrucciones"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <HelpCircle className="nav-icon" size={18} />
                  <span>Información</span>
                </NavLink>

                {/* Acceso exclusivo para administradores */}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `nav-link nav-link-admin ${isActive ? 'active' : ''}`}
                  >
                    <Shield className="nav-icon" size={18} />
                    <span>Admin</span>
                  </NavLink>
                )}

                {/* Badge de usuario y botón de cerrar sesión con confirmación */}
                <div className="nav-user-badge">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="trainer-avatar-mini" />
                  ) : (
                    <span className="trainer-avatar-mini-initial">
                      {user.name ? user.name.charAt(0) : 'E'}
                    </span>
                  )}
                  <span className="user-name-text">{user.name || user.username}</span>
                  <span className={`badge-role ${isAdmin ? 'role-admin' : 'role-player'}`}>
                    {user.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="btn-icon-logout"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <LogIn className="nav-icon" size={18} />
                  <span>Iniciar Sesión</span>
                </NavLink>

                <NavLink
                  to="/clasificacion"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Globe className="nav-icon" size={18} />
                  <span>Clasificación</span>
                </NavLink>

                <NavLink
                  to="/instrucciones"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <HelpCircle className="nav-icon" size={18} />
                  <span>Información</span>
                </NavLink>

                <NavLink
                  to="/resultados"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Trophy className="nav-icon" size={18} />
                  <span>Récords</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Modal de confirmación para cerrar sesión desde el menú */}
      {showLogoutModal && (
        <div className="confirm-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
          <div className="confirm-modal-card modal-logout">
            <div className="confirm-modal-header">
              <div className="confirm-icon-box info">
                <LogOut size={24} />
              </div>
              <h3 className="confirm-modal-title">¿Cerrar sesión?</h3>
            </div>

            <div className="confirm-modal-body">
              <p>
                Toda tu información, <strong>puntos acumulados ({user?.totalScore || 0} pts)</strong>, partidas,
                récords y avatar permanecerán asociados a tu cuenta de entrenador.
              </p>
            </div>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleConfirmLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
