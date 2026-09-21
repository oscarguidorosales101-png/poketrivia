import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRecords, getScores } from '../services/scoreService';
import { LEVEL_CONFIG } from '../utils/helpers';
import {
  Gamepad2,
  Trophy,
  HelpCircle,
  Play,
  Sparkles,
  Shield,
  Heart,
  Flame,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';

export const PlayerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [records, setRecords] = useState({ beginner: 0, advanced: 0, master: 0 });
  const [recentMatches, setRecentMatches] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('principiante');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      const [highRecords, matchScores] = await Promise.all([getRecords(), getScores()]);
      setRecords(highRecords);
      setRecentMatches(matchScores.scores?.slice(0, 5) || []);
      setIsLoading(false);
    };
    loadDashboardData();
  }, []);

  const handleStartGame = () => {
    navigate(`/juego/${selectedDifficulty}`);
  };

  return (
    <div className="page-container page-player-dashboard">
      {/* Banner de Bienvenida del Entrenador */}
      <div className="dashboard-trainer-hero animate-fade-in">
        <div className="trainer-hero-info">
          <div className="trainer-avatar-ring">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="trainer-avatar-mini-img" />
            ) : (
              <span className="trainer-initial">{user?.name ? user.name.charAt(0) : 'E'}</span>
            )}
          </div>
          <div>
            <div className="trainer-badges-line">
              <span className="role-pill player">{user?.role || 'PLAYER'}</span>
              <span className="sub-badge-pill">
                {user?.subscription?.plan || 'Plan Gratuito'}
              </span>
              <span className="accum-pts-pill">
                ⭐ {user?.totalScore || 0} pts totales
              </span>
            </div>
            <h1 className="trainer-display-name">
              ¡Bienvenido, <span className="highlight-text">{user?.name || user?.username}!</span>
            </h1>
            <p className="trainer-subtitle">
              Tienes <strong>{user?.hints ?? 5} pistas disponibles</strong> para tus partidas de supervivencia.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-start-hero"
          onClick={handleStartGame}
        >
          <Play size={20} className="fill-current" />
          <span>Iniciar Partida Infinita</span>
        </button>
      </div>

      {/* Tarjetas de Récords Independientes por Dificultad */}
      <div className="dashboard-section">
        <div className="section-header-compact">
          <Trophy size={20} className="icon-gold" />
          <h2 className="section-title-sm">Tus Récords de Supervivencia</h2>
        </div>

        <div className="difficulty-selection-grid">
          {Object.entries(LEVEL_CONFIG)
            .filter(([key]) => ['principiante', 'avanzado', 'maestro'].includes(key))
            .map(([diffKey, config]) => {
              const isSelected = selectedDifficulty === diffKey;
              const recordValue = records[config.recordKey] || 0;

              return (
                <div
                  key={config.id}
                  className={`diff-selection-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedDifficulty(diffKey)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedDifficulty(diffKey)}
                >
                  <div className="card-top-row">
                    <span className="diff-badge">{config.badge}</span>
                    <span className="diff-gen-tag">Gen {config.generation}</span>
                  </div>

                  <h3 className="diff-title">{config.name}</h3>

                  <div className="diff-record-box">
                    <span className="record-label">RÉCORD ACTUAL</span>
                    <span className="record-pts">{recordValue} pts</span>
                  </div>

                  <div className="diff-rules-row">
                    <span>
                      <Heart size={14} className="icon-heart" /> {config.lives} vidas
                    </span>
                    <span>+{config.basePoints} pts base</span>
                  </div>

                  <div className="diff-select-indicator">
                    {isSelected ? '✓ Seleccionado para jugar' : 'Clic para seleccionar'}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Partidas Recientes */}
      <div className="dashboard-section">
        <div className="section-header-compact">
          <Gamepad2 size={20} />
          <h2 className="section-title-sm">Partidas Recientes de Supervivencia</h2>
        </div>

        {recentMatches.length === 0 ? (
          <div className="empty-matches-card">
            <p>Aún no has jugado ninguna partida de supervivencia. ¡Inicia tu primera aventura!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Entrenador</th>
                  <th>Dificultad</th>
                  <th>Puntos</th>
                  <th>Racha</th>
                  <th>Preguntas</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((m) => (
                  <tr key={m.id}>
                    <td className="trainer-name">{m.playerName}</td>
                    <td>
                      <span className={`level-pill pill-${m.difficulty}`}>
                        {m.difficulty} (Gen {m.generation || 1})
                      </span>
                    </td>
                    <td className="score-cell">{m.score} pts</td>
                    <td>{m.bestStreak || 0}</td>
                    <td>{m.questionsAnswered || m.correctAnswers || 0}</td>
                    <td className="date-cell">
                      {m.date ? new Date(m.date).toLocaleDateString() : 'Reciente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enlaces y Ayuda */}
      <div className="dashboard-bottom-links">
        <Link to="/clasificacion" className="quick-link">
          <Trophy size={18} />
          <span>Clasificación Mundial</span>
        </Link>
        <span className="dot-divider">•</span>
        <Link to="/resultados" className="quick-link">
          <Award size={18} />
          <span>Historial de Partidas</span>
        </Link>
        <span className="dot-divider">•</span>
        <Link to="/instrucciones" className="quick-link">
          <HelpCircle size={18} />
          <span>Reglas de Supervivencia</span>
        </Link>
      </div>
    </div>
  );
};
