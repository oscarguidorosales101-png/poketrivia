import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  HelpCircle,
  Layers,
  Users,
  Trophy,
  Sliders,
  Sparkles,
  Zap,
  Tag,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Barra Lateral Administrativa (Única navegación principal del Administrador) */}
      <aside className="admin-sidebar" aria-label="Navegación del Administrador">
        <div className="admin-sidebar-header">
          <div className="admin-brand-badge">
            <ShieldCheck size={22} className="icon-gold" />
          </div>
          <div className="admin-header-titles">
            <h2 className="admin-panel-title">Admin Console</h2>
            <span className="admin-panel-sub">Liga Pokémon Master</span>
          </div>
        </div>

        <nav className="admin-nav-menu" aria-label="Menú Administrativo">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><BarChart3 size={18} /></span>
            <span className="admin-nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/preguntas"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><HelpCircle size={18} /></span>
            <span className="admin-nav-label">Preguntas</span>
          </NavLink>

          <NavLink
            to="/admin/variaciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Tag size={18} /></span>
            <span className="admin-nav-label">Variaciones</span>
          </NavLink>

          <NavLink
            to="/admin/jugadores"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Users size={18} /></span>
            <span className="admin-nav-label">Jugadores</span>
          </NavLink>

          <NavLink
            to="/admin/puntuaciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Trophy size={18} /></span>
            <span className="admin-nav-label">Puntuaciones</span>
          </NavLink>

          <NavLink
            to="/admin/generaciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Layers size={18} /></span>
            <span className="admin-nav-label">Generaciones</span>
          </NavLink>

          <NavLink
            to="/admin/dificultades"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Sliders size={18} /></span>
            <span className="admin-nav-label">Dificultades</span>
          </NavLink>

          <NavLink
            to="/admin/pistas"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Sparkles size={18} /></span>
            <span className="admin-nav-label">Pistas</span>
          </NavLink>

          <NavLink
            to="/admin/suscripciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon"><Zap size={18} /></span>
            <span className="admin-nav-label">Suscripciones</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          {/* Tarjeta de Identidad del Administrador */}
          <div className="admin-user-card">
            <div className="admin-user-avatar-wrapper">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar Admin" className="admin-user-avatar" />
              ) : (
                <span className="admin-user-initial">
                  {user?.name ? user.name.charAt(0) : 'O'}
                </span>
              )}
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name" title={user?.name || 'Profesor Oak'}>
                {user?.name || 'Profesor Oak'}
              </span>
              <span className="admin-user-role-badge">ADMIN</span>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="admin-btn-logout"
              title="Cerrar sesión"
              aria-label="Cerrar sesión de Administrador"
            >
              <LogOut size={16} />
            </button>
          </div>

          <div className="admin-system-status">
            <span className="status-dot-active"></span>
            <span>Sistema Operativo • Consola Activa</span>
          </div>
        </div>
      </aside>

      {/* Contenedor del contenido administrativo */}
      <div className="admin-main-viewport">
        <Outlet />
      </div>

      {/* Modal de confirmación para cerrar sesión del Admin */}
      {showLogoutModal && (
        <div className="confirm-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
          <div className="confirm-modal-card modal-logout">
            <div className="confirm-modal-header">
              <div className="confirm-icon-box info">
                <LogOut size={24} />
              </div>
              <h3 className="confirm-modal-title">¿Cerrar sesión de Administrador?</h3>
            </div>

            <div className="confirm-modal-body">
              <p>
                Saldrás de la consola administrativa. Tus cambios, configuraciones y datos de la Liga
                permanecen resguardados en el sistema.
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
    </div>
  );
};
