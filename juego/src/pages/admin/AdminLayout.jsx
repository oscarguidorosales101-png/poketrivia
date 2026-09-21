import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
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
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout = () => {
  return (
    <div className="admin-layout-wrapper">
      {/* Barra Lateral Administrativa */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <ShieldCheck size={24} className="icon-gold" />
          <div>
            <h2 className="admin-panel-title">Admin Console</h2>
            <span className="admin-panel-sub">Liga Pokémon Master</span>
          </div>
        </div>

        <nav className="admin-nav-menu">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/preguntas"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <HelpCircle size={18} />
            <span>Preguntas</span>
          </NavLink>

          <NavLink
            to="/admin/variaciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Tag size={18} />
            <span>Variaciones</span>
          </NavLink>

          <NavLink
            to="/admin/jugadores"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Jugadores</span>
          </NavLink>

          <NavLink
            to="/admin/puntuaciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Trophy size={18} />
            <span>Puntuaciones</span>
          </NavLink>

          <NavLink
            to="/admin/generaciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Layers size={18} />
            <span>Generaciones</span>
          </NavLink>

          <NavLink
            to="/admin/dificultades"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Sliders size={18} />
            <span>Dificultades</span>
          </NavLink>

          <NavLink
            to="/admin/pistas"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={18} />
            <span>Pistas</span>
          </NavLink>

          <NavLink
            to="/admin/suscripciones"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Zap size={18} />
            <span>Suscripciones</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/jugador" className="btn btn-secondary btn-sm w-full">
            <ArrowLeft size={16} />
            <span>Ir a Modo Jugador</span>
          </Link>
        </div>
      </aside>

      {/* Contenedor del contenido administrativo */}
      <div className="admin-main-viewport">
        <Outlet />
      </div>
    </div>
  );
};
