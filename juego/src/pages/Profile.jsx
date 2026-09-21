import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { getRecords } from '../services/scoreService';
import { updateUserProfile } from '../services/authService';
import {
  User,
  Shield,
  Zap,
  Calendar,
  Sparkles,
  Trophy,
  Gamepad2,
  Flame,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Camera,
  LogOut,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [records, setRecords] = useState({ beginner: 0, advanced: 0, master: 0 });
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const sub = user?.subscription || { type: 'FREE', status: 'active', plan: 'Plan Gratuito' };

  useEffect(() => {
    getRecords().then((recs) => {
      setRecords(recs);
    });
  }, []);

  // Manejador de subida de imagen de perfil local
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Límite de 3MB
    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen seleccionada no debe superar los 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result;
      if (typeof base64Url === 'string') {
        setAvatarSrc(base64Url);
        if (user?.id) {
          setIsSavingAvatar(true);
          await updateUserProfile(user.id, { avatar: base64Url });
          setIsSavingAvatar(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  // Cálculo de estadísticas
  const totalQuestions = Number(user?.questionsAnswered) || 0;
  const correctCount = Number(user?.correctAnswers) || 0;
  const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : '100.0';

  return (
    <div className="page-container page-profile">
      <div className="profile-card animate-fade-in">
        {/* Cabecera del Perfil con Avatar Personalizable */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.name || 'Entrenador'}
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-default">
                <span>{user?.name ? user.name.charAt(0) : 'E'}</span>
              </div>
            )}

            <button
              type="button"
              className="btn-avatar-edit"
              title="Cambiar imagen de perfil desde tu dispositivo"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSavingAvatar}
            >
              <Camera size={16} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden-file-input"
              onChange={handleAvatarFileChange}
            />
          </div>

          <div className="profile-titles">
            <div className="profile-badges-row">
              <span className={`badge-role ${isAdmin ? 'role-admin' : 'role-player'}`}>
                Rol: {user?.role || 'PLAYER'}
              </span>
              <span className={`sub-status-pill ${sub.type === 'PREMIUM' ? 'sub-premium' : 'sub-free'}`}>
                {sub.type}
              </span>
              {isSavingAvatar && <span className="text-muted text-xs">Guardando avatar...</span>}
            </div>
            <h1 className="profile-name">{user?.name || 'Entrenador'}</h1>
            <span className="profile-username">@{user?.username}</span>
          </div>
        </div>

        {/* Bloque 1: Estadísticas Acumuladas del Jugador */}
        <div className="profile-section">
          <div className="section-title-wrapper">
            <Trophy size={20} className="icon-gold" />
            <h2 className="profile-section-title">Estadísticas de Supervivencia</h2>
          </div>

          <div className="profile-stats-cards-grid">
            <div className="profile-stat-box">
              <span className="stat-box-label">
                <Sparkles size={14} className="icon-gold" /> Puntos Totales
              </span>
              <span className="stat-box-value gold">{user?.totalScore || 0} pts</span>
              <span className="stat-box-sub">Acumulado en partidas</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label">
                <Gamepad2 size={14} className="icon-blue" /> Partidas Jugadas
              </span>
              <span className="stat-box-value blue">{user?.matchesPlayed || 0}</span>
              <span className="stat-box-sub">Supervivencias finalizadas</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label">
                <Flame size={14} className="icon-flame" /> Mejor Racha
              </span>
              <span className="stat-box-value">{user?.bestStreak || 0} seguidas</span>
              <span className="stat-box-sub">Máximo multiplicador</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label">
                <Target size={14} className="icon-green" /> Precisión Global
              </span>
              <span className="stat-box-value green">{accuracy}%</span>
              <span className="stat-box-sub">
                {correctCount} correctas / {totalQuestions} preguntas
              </span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label">
                <HelpCircle size={14} /> Pistas Usadas
              </span>
              <span className="stat-box-value">{user?.hintsUsed || 0}</span>
              <span className="stat-box-sub">Comodines consumidos</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label">
                <Shield size={14} /> Dificultad Favorita
              </span>
              <span className="stat-box-value capitalize">{user?.favoriteDifficulty || 'Principiante'}</span>
              <span className="stat-box-sub">Mayor actividad</span>
            </div>
          </div>
        </div>

        {/* Bloque 2: Récords Independientes por Dificultad */}
        <div className="profile-section">
          <div className="section-title-wrapper">
            <Trophy size={20} />
            <h2 className="profile-section-title">Récords por Dificultad</h2>
          </div>

          <div className="profile-stats-cards-grid">
            <div className="profile-stat-box">
              <span className="stat-box-label text-success">Principiante (Gen 1)</span>
              <span className="stat-box-value">{records.beginner} pts</span>
              <span className="stat-box-sub">5 vidas iniciales</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label text-warning">Avanzado (Gen 2)</span>
              <span className="stat-box-value">{records.advanced} pts</span>
              <span className="stat-box-sub">4 vidas iniciales</span>
            </div>

            <div className="profile-stat-box">
              <span className="stat-box-label text-error">Maestro (Gen 3)</span>
              <span className="stat-box-value">{records.master} pts</span>
              <span className="stat-box-sub">3 vidas iniciales</span>
            </div>
          </div>
        </div>

        {/* Bloque 3: Información de Suscripción */}
        <div className="profile-section">
          <div className="section-title-wrapper">
            <Zap size={20} className="icon-gold" />
            <h2 className="profile-section-title">Detalles de la Cuenta</h2>
          </div>

          <div className="subscription-box">
            <div className="sub-info-item">
              <span className="sub-label">Plan Activo</span>
              <span className="sub-val highlight">{sub.plan || 'Plan Gratuito'}</span>
            </div>

            <div className="sub-info-item">
              <span className="sub-label">Estado</span>
              <span className="sub-val text-success">
                {sub.status === 'active' ? '● Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="sub-info-item">
              <span className="sub-label">Pistas Restantes</span>
              <span className="sub-val">{user?.hints ?? 5} pistas</span>
            </div>

            <div className="sub-info-item">
              <span className="sub-label">Fecha de Registro</span>
              <span className="sub-val">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Temporada 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones del Perfil */}
        <div className="profile-actions">
          <Link to="/jugador" className="btn btn-primary">
            <span>Ir al Panel de Juego</span>
            <ArrowRight size={18} />
          </Link>

          <button
            type="button"
            className="btn btn-cancel-modal"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={18} />
            <span>Salir de la Cuenta</span>
          </button>
        </div>
      </div>

      {/* Modal de Confirmación para Cerrar Sesión */}
      {showLogoutConfirm && (
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
                Toda tu información, <strong>puntos acumulados ({user?.totalScore || 0} pts)</strong>, partidas jugadas,
                récords y avatar permanecerán perfectamente asociados a tu cuenta al volver a ingresar.
              </p>
            </div>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={() => setShowLogoutConfirm(false)}
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
