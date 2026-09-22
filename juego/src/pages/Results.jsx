import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getScores, getRecords } from '../services/scoreService';
import { getN8nWebhookUrl, setN8nWebhookUrl } from '../services/n8nService';
import {
  Trophy,
  Award,
  RotateCcw,
  Globe,
  Settings,
  Flame,
  CheckCircle2,
  XCircle,
  Database,
  User,
  Gamepad2
} from 'lucide-react';

export const Results = () => {
  const { user, isAuthenticated } = useAuth();
  const [allScores, setAllScores] = useState([]);
  const [globalRecords, setGlobalRecords] = useState({ beginner: 0, advanced: 0, master: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [storageSource, setStorageSource] = useState('server');
  const [webhookUrl, setWebhookUrl] = useState(getN8nWebhookUrl());
  const [showConfig, setShowConfig] = useState(false);
  const [viewMode, setViewMode] = useState('my'); // 'my' | 'all'

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getScores(), getRecords()]).then(([scoresRes, recs]) => {
      setAllScores(scoresRes.scores || []);
      setStorageSource(scoresRes.source || 'server');
      setGlobalRecords(recs);
      setIsLoading(false);
    });
  }, []);

  const handleSaveWebhookConfig = (e) => {
    e.preventDefault();
    setN8nWebhookUrl(webhookUrl);
    setShowConfig(false);
  };

  // Récords a mostrar: si está en modo personal, los del usuario activo
  const displayedRecords = useMemo(() => {
    if (viewMode === 'my' && user?.records) {
      return user.records;
    }
    return globalRecords;
  }, [viewMode, user?.records, globalRecords]);

  // Historial filtrado
  const displayedScores = useMemo(() => {
    if (viewMode === 'my' && user?.id) {
      return allScores.filter(
        (s) => s.playerId === user.id || s.playerName === user.name
      );
    }
    return allScores;
  }, [viewMode, allScores, user?.id, user?.name]);

  return (
    <div className="page-container page-results">
      <div className="instructions-hero">
        <div className="hero-badge">
          <Award size={16} className="icon-gold" />
          <span>Historial de Partidas y Récords</span>
        </div>
        <h1 className="hero-title">
          {viewMode === 'my' && user ? (
            <>
              Historial de <span className="gradient-text">{user.name || user.username}</span>
            </>
          ) : (
            <>
              Récords de <span className="gradient-text">Supervivencia</span>
            </>
          )}
        </h1>
        <p className="hero-subtitle">
          {viewMode === 'my' && user
            ? 'Consulta tus marcas máximas y el histórico de tus partidas finalizadas en esta cuenta.'
            : 'Récords independientes por dificultad e histórico general de partidas de la arena.'}
        </p>
      </div>

      {/* Selector de Vista: Mis Partidas vs Todas */}
      {isAuthenticated && (
        <div className="leaderboard-filter-tabs mb-2">
          <button
            type="button"
            className={`tab-btn-leaderboard ${viewMode === 'my' ? 'active' : ''}`}
            onClick={() => setViewMode('my')}
          >
            <User size={16} />
            <span>Mi Historial ({user?.name || user?.username})</span>
          </button>
          <button
            type="button"
            className={`tab-btn-leaderboard ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            <Globe size={16} />
            <span>Historial Global</span>
          </button>
        </div>
      )}

      {/* Récords Independientes por Dificultad */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-green">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Principiante (Gen 1)</span>
            <span className="admin-stat-val">{displayedRecords.beginner || 0} pts</span>
            <span className="admin-stat-trend">❤️ 5 vidas iniciales</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Avanzado (Gen 2)</span>
            <span className="admin-stat-val">{displayedRecords.advanced || 0} pts</span>
            <span className="admin-stat-trend">❤️ 4 vidas iniciales</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-red">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Maestro (Gen 3)</span>
            <span className="admin-stat-val">{displayedRecords.master || 0} pts</span>
            <span className="admin-stat-trend">❤️ 3 vidas iniciales</span>
          </div>
        </div>
      </div>

      {/* Configuración n8n */}
      <div className="n8n-status-section">
        <div className="n8n-status-header">
          <div className="n8n-tag">
            <Globe size={16} />
            <span>Integración n8n Webhook</span>
          </div>
          <button
            type="button"
            className="btn-link-config"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings size={15} />
            <span>Configurar URL</span>
          </button>
        </div>

        {showConfig && (
          <form onSubmit={handleSaveWebhookConfig} className="n8n-config-form">
            <label className="config-label">URL del Webhook de n8n:</label>
            <div className="config-input-group">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="input-control input-sm"
                required
              />
              <button type="submit" className="btn btn-sm btn-primary">
                Guardar URL
              </button>
            </div>
          </form>
        )}

        <p className="n8n-subtext">
          Al concluir cada partida de supervivencia, los datos del jugador activo se envían a <code>{webhookUrl}</code>.
        </p>
      </div>

      {/* Historial de Partidas */}
      <div className="leaderboard-section">
        <div className="leaderboard-header">
          <div className="title-with-icon">
            <Award size={24} className="icon-trophy" />
            <h2 className="section-title">
              {viewMode === 'my' ? 'Tus Partidas de Supervivencia' : 'Historial de Partidas Guardadas'}
            </h2>
          </div>

          <div className="source-indicator">
            <Database size={16} />
            <span>
              Origen: {storageSource === 'server' ? 'Servidor db.json' : 'Almacenamiento Local'}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-scores-state">
            <span className="spinner-mini"></span>
            <span>Cargando partidas...</span>
          </div>
        ) : displayedScores.length === 0 ? (
          <div className="empty-scores">
            <p>
              {viewMode === 'my'
                ? 'Aún no has finalizado partidas de supervivencia con esta cuenta. ¡Inicia una partida para sumar tus puntos!'
                : 'Aún no hay partidas registradas en el sistema.'}
            </p>
            <Link to="/jugador" className="btn btn-primary btn-sm">
              Iniciar Supervivencia
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Entrenador</th>
                  <th>Dificultad</th>
                  <th>Puntos</th>
                  <th>Racha</th>
                  <th>Preguntas</th>
                  <th>Aciertos</th>
                  <th>Pistas</th>
                  <th>Récord</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {displayedScores.map((item, index) => (
                  <tr key={item.id} className={index === 0 ? 'top-row' : ''}>
                    <td className="rank-cell">
                      {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `${index + 1}`}
                    </td>
                    <td className="trainer-name">
                      <span className="trainer-avatar-mini-initial">
                        {item.playerName ? item.playerName.charAt(0) : 'E'}
                      </span>
                      <strong>{item.playerName}</strong>
                    </td>
                    <td>
                      <span className={`level-pill pill-${item.difficulty || item.level}`}>
                        {item.difficulty || item.level}
                      </span>
                    </td>
                    <td className="score-cell">{item.score} pts</td>
                    <td>
                      <span className="inline-flex items-center gap-1">
                        <Flame size={13} className="text-warning" />
                        {item.bestStreak || 0}
                      </span>
                    </td>
                    <td>{item.questionsAnswered || item.correctAnswers || 0}</td>
                    <td className="text-success font-bold">{item.correctAnswers || 0}</td>
                    <td>{item.hintsUsed || 0}</td>
                    <td>
                      {item.isNewRecord ? (
                        <span className="badge-new-rec">★ Récord</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="date-cell">
                      {item.date ? new Date(item.date).toLocaleDateString() : 'Reciente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="result-actions mt-4 text-center">
        <Link to="/jugador" className="btn btn-primary btn-lg">
          <Gamepad2 size={18} />
          <span>Volver al Panel de Juego</span>
        </Link>
      </div>
    </div>
  );
};

