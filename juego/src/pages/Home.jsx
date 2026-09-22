import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Shield, User, AlertCircle, Sparkles } from 'lucide-react';

// Detección dinámica de cualquier animación o GIF dentro de public/gift
const detectedGiftModules = import.meta.glob(
  [
    '/public/gift/*.{gif,mp4,webm,webp,png,jpg,jpeg}'
  ],
  { eager: true, query: '?url', import: 'default' }
);

export const Home = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('PLAYER'); // PLAYER | ADMIN
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolver la URL de la animación encontrada automáticamente en public/gift
  const animationData = useMemo(() => {
    const keys = Object.keys(detectedGiftModules);
    if (keys.length > 0) {
      const chosenKey = keys[0];
      const rawUrl = detectedGiftModules[chosenKey];
      const url = typeof rawUrl === 'string' ? rawUrl : rawUrl?.default || chosenKey.replace(/^\/public/, '');
      const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
      return { url, isVideo };
    }
    // Fallback garantizado servido por Vite
    return { url: '/gift/pokemon-cute.gif', isVideo: false };
  }, []);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/jugador');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await login(username, password, selectedRole);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/jugador');
      }
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleFillCredentials = (u, p, role) => {
    setUsername(u);
    setPassword(p);
    setSelectedRole(role);
    setErrorMsg(null);
  };

  return (
    <div className="login-fullscreen-viewport">
      {/* Fondo inmersivo con el GIF que ocupa el 100% de la pantalla */}
      <div className="login-backdrop-container">
        {animationData.isVideo ? (
          <video
            src={animationData.url}
            autoPlay
            loop
            muted
            playsInline
            className="login-fullscreen-media"
          />
        ) : (
          <img
            src={animationData.url}
            alt="Fondo PokéTrivia"
            className="login-fullscreen-media"
          />
        )}
        <div className="login-backdrop-overlay"></div>
      </div>

      {/* Formulario centrado horizontal y verticalmente */}
      <div className="login-center-wrapper animate-fade-in">
        <div className="login-auth-card">
          <div className="login-brand-header">
            <div className="login-pokeball-wrapper">
              <span className="pokeball-icon"></span>
            </div>
            <h1 className="login-brand-title">PokéTrivia</h1>
            <p className="login-brand-subtitle">Survival Master</p>
          </div>

          {/* Selector de Rol */}
          <div className="role-switch-container">
            <button
              type="button"
              className={`role-switch-btn ${selectedRole === 'PLAYER' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('PLAYER');
                setErrorMsg(null);
              }}
            >
              <User size={15} />
              <span>Jugador</span>
            </button>
            <button
              type="button"
              className={`role-switch-btn ${selectedRole === 'ADMIN' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('ADMIN');
                setErrorMsg(null);
              }}
            >
              <Shield size={15} />
              <span>Administrador</span>
            </button>
          </div>

          {errorMsg && (
            <div className="auth-error-banner animate-shake" role="alert">
              <AlertCircle size={17} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group text-center">
              <label className="form-label justify-center" htmlFor="usernameInput">
                <User size={16} />
                <span>Usuario</span>
              </label>
              <input
                id="usernameInput"
                type="text"
                className="input-control text-center"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group text-center">
              <label className="form-label justify-center" htmlFor="passwordInput">
                <Shield size={16} />
                <span>Contraseña</span>
              </label>
              <input
                id="passwordInput"
                type="password"
                className="input-control text-center"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-auth-submit"
              disabled={isSubmitting}
            >
              <LogIn size={18} />
              <span>{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}</span>
            </button>
          </form>

          {/* Cuentas de Acceso Rápido */}
          <div className="demo-credentials-box">
            <span className="demo-box-title text-center">Acceso Rápido para Pruebas:</span>
            <div className="demo-buttons-row">
              <button
                type="button"
                className={`btn-demo-account ${username === 'ash' ? 'selected' : ''}`}
                onClick={() => handleFillCredentials('ash', 'pikachu123', 'PLAYER')}
              >
                <User size={13} />
                <span>Ash (Jugador)</span>
              </button>

              <button
                type="button"
                className={`btn-demo-account ${username === 'misty' ? 'selected' : ''}`}
                onClick={() => handleFillCredentials('misty', 'starmie123', 'PLAYER')}
              >
                <User size={13} />
                <span>Misty (Jugador)</span>
              </button>

              <button
                type="button"
                className={`btn-demo-account admin-btn ${username === 'oak' ? 'selected' : ''}`}
                onClick={() => handleFillCredentials('oak', 'profesor123', 'ADMIN')}
              >
                <Shield size={13} />
                <span>Prof. Oak (Admin)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


