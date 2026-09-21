import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Database
} from 'lucide-react';

export const Results = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [records, setRecords] = useState({ beginner: 0, advanced: 0, master: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [storageSource, setStorageSource] = useState('server');
  const [webhookUrl, setWebhookUrl] = useState(getN8nWebhookUrl());
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getScores(), getRecords()]).then(([scoresRes, recs]) => {
      setLeaderboard(scoresRes.scores || []);
      setStorageSource(scoresRes.source || 'server');
      setRecords(recs);
      setIsLoading(false);
    });
  }, []);

  const handleSaveWebhookConfig = (e) => {
    e.preventDefault();
    setN8nWebhookUrl(webhookUrl);
    setShowConfig(false);
  };

  return (
    <div className="page-container page-results">
      <div className="instructions-hero">
        <div className="hero-badge">
          <Trophy size={16} className="icon-gold" />
          <span>Salón de la Fama</span>
        </div>
        <h1 className="hero-title">
          Récords de <span className="gradient-text">Supervivencia</span>
        </h1>
        <p className="hero-subtitle">
          Récords independientes por dificultad e histórico de partidas de todos los entrenadores.
        </p>
      </div>

      {/* Récords Independientes por Dificultad */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-green">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Principiante (Gen 1)</span>
            <span className="admin-stat-val">{records.beginner} pts</span>
            <span className="admin-stat-trend">❤️ 5 vidas iniciales</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Avanzado (Gen 2)</span>
            <span className="admin-stat-val">{records.advanced} pts</span>
            <span className="admin-stat-trend">❤️ 4 vidas iniciales</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-red">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Maestro (Gen 3)</span>
            <span className="admin-stat-val">{records.master} pts</span>
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
          Al concluir cada partida de supervivencia, los datos completos se envían a <code>{webhookUrl}</code>.
          Importa <code>n8n/workflow.json</code> en n8n para activar el flujo de evaluación.
        </p>
      </div>

      {/* Historial de Partidas */}
      <div className="leaderboard-section">
        <div className="leaderboard-header">
          <div className="title-with-icon">
            <Award size={24} className="icon-trophy" />
            <h2 className="section-title">Historial de Partidas Guardadas</h2>
          </div>

          <div className="source-indicator">
            <Database size={16} />
            <span>
              Origen: {storageSource === 'server' ? 'Servidor db.json (json-server)' : 'Almacenamiento Local'}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-scores-state">
            <span className="spinner-mini"></span>
            <span>Cargando partidas...</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="empty-scores">
            <p>Aún no hay partidas registradas.</p>
            <Link to="/jugador" className="btn btn-primary btn-sm">
              Iniciar Primera Partida
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
                  <th>Pistas</th>
                  <th>Récord</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item.id} className={index === 0 ? 'top-row' : ''}>
                    <td className="rank-cell">
                      {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `${index + 1}`}
                    </td>
                    <td className="trainer-name">{item.playerName}</td>
                    <td>
                      <span className={`level-pill pill-${item.difficulty}`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="score-cell">{item.score} pts</td>
                    <td>{item.bestStreak || 0}</td>
                    <td>{item.questionsAnswered || item.correctAnswers || 0}</td>
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
          <RotateCcw size={18} />
          <span>Volver al Panel de Juego</span>
        </Link>
      </div>
    </div>
  );
};
