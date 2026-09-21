import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Shield, User, Sparkles, AlertCircle, KeyRound, Film } from 'lucide-react';

// Detección dinámica y automática de cualquier animación dentro de public/gift o src/public/gift
// NO asume ningún nombre de archivo estático
const detectedGiftModules = import.meta.glob(
  [
    '/public/gift/*.{gif,mp4,webm,webp,png,jpg,jpeg}',
    '/src/public/gift/*.{gif,mp4,webm,webp,png,jpg,jpeg}'
  ],
  { eager: true, query: '?url', import: 'default' }
);

export const Home = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolver la URL de la animación encontrada automáticamente
  const animationData = useMemo(() => {
    const keys = Object.keys(detectedGiftModules);
    if (keys.length > 0) {
      const chosenKey = keys[0];
      const rawUrl = detectedGiftModules[chosenKey];
      const url = typeof rawUrl === 'string' ? rawUrl : rawUrl?.default || chosenKey;
      const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
      return { url, isVideo, filename: chosenKey.split('/').pop() };
    }
    // Fallback garantizado servido por Vite en /gift/
    return { url: '/gift/pokemon-cute.gif', isVideo: false, filename: 'pokemon-cute.gif' };
  }, []);

  // Si ya está autenticado, sugerir redirigir
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/jugador');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await login(username, password);
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

  const handleFillCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
  };

  return (
    <div className="page-container page-auth page-auth-with-animation">
      {/* Fondo de animación inmersiva integrada con overlay para legibilidad */}
      <div className="auth-animation-backdrop">
        {animationData.isVideo ? (
          <video
            src={animationData.url}
            autoPlay
            loop
            muted
            playsInline
            className="auth-bg-media"
          />
        ) : (
          <img
            src={animationData.url}
            alt="Animación de bienvenida"
            className="auth-bg-media"
          />
        )}
        <div className="auth-backdrop-overlay"></div>
      </div>

      <div className="home-hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Liga Pokémon — Acceso a la Arena</span>
        </div>
        <h1 className="hero-title">
          PokéTrivia <span className="gradient-text">Survival Master</span>
        </h1>
        <p className="hero-subtitle">
          Supervivencia infinita de preguntas y respuestas. Demuestra tus conocimientos Pokémon,
          acumula puntos, supera récords y escala en la clasificación mundial.
        </p>
      </div>

      <div className="auth-main-layout animate-fade-in">
        {/* Tarjeta de visualización destacada de la animación */}
        <div className="auth-visual-preview-card">
          <div className="animation-badge-header">
            <Film size={15} />
            <span>Animación en Vivo ({animationData.filename})</span>
          </div>
          <div className="auth-visual-media-container">
            {animationData.isVideo ? (
              <video
                src={animationData.url}
                autoPlay
                loop
                muted
                playsInline
                className="auth-interactive-media"
              />
            ) : (
              <img
                src={animationData.url}
                alt="Pokémon Animation"
                className="auth-interactive-media"
              />
            )}
          </div>
          <p className="auth-visual-caption">
            ¡Prepárate para el desafío de supervivencia! Cada vida cuenta.
          </p>
        </div>

        {/* Formulario de Login */}
        <div className="setup-card auth-card">
          <div className="card-header-simple">
            <KeyRound size={26} className="auth-header-icon" />
            <h2 className="auth-card-title">Identificación de Entrenador</h2>
          </div>

          {errorMsg && (
            <div className="auth-error-banner animate-shake" role="alert">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="usernameInput">
              <User size={18} />
              <span>Usuario</span>
            </label>
            <input
              id="usernameInput"
              type="text"
              className="input-control"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="passwordInput">
              <Shield size={18} />
              <span>Contraseña</span>
            </label>
            <input
              id="passwordInput"
              type="password"
              className="input-control"
              placeholder="Contraseña"
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
            <LogIn size={20} />
            <span>{isSubmitting ? 'Verificando...' : 'Entrar a la Arena'}</span>
          </button>
        </form>

        {/* Acceso Rápido con Credenciales de Demostración */}
        <div className="demo-credentials-box">
          <span className="demo-box-title">Cuentas Registradas en db.json:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn-demo-account"
              onClick={() => handleFillCredentials('ash', 'pikachu123')}
            >
              <User size={15} />
              <span>Cargar <strong>Ash</strong> (PLAYER)</span>
            </button>

            <button
              type="button"
              className="btn-demo-account admin-btn"
              onClick={() => handleFillCredentials('oak', 'profesor123')}
            >
              <Shield size={15} />
              <span>Cargar <strong>Prof. Oak</strong> (ADMIN)</span>
            </button>
          </div>
          <span className="demo-hint">
            Haz clic en cualquiera de las cuentas para autocompletar credenciales y probar los permisos.
          </span>
        </div>
      </div>
    </div>
  </div>
);
};

