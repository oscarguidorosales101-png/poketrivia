import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getScores, getRecords } from '../services/scoreService';
import {
  Globe,
  Trophy,
  Award,
  Sparkles,
  Flame,
  Gamepad2,
  Filter,
  CheckCircle2,
  Calendar,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [records, setRecords] = useState({ beginner: 0, advanced: 0, master: 0 });
  const [activeFilter, setActiveFilter] = useState('all'); // all | principiante | avanzado | maestro
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getScores(), getRecords()]).then(([scoresRes, recs]) => {
      setScores(scoresRes.scores || []);
      setRecords(recs);
      setIsLoading(false);
    });
  }, []);

  // Filtrado y ordenamiento de puntuaciones
  const filteredScores = useMemo(() => {
    let list = [...scores];
    if (activeFilter !== 'all') {
      list = list.filter((s) => {
        const diff = (s.difficulty || s.level || '').toLowerCase();
        if (activeFilter === 'principiante') return diff.includes('principiante') || diff.includes('facil');
        if (activeFilter === 'avanzado') return diff.includes('avanzado') || diff.includes('medio');
        if (activeFilter === 'maestro') return diff.includes('maestro') || diff.includes('dificil');
        return true;
      });
    }
    return list.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  }, [scores, activeFilter]);

  return (
    <div className="page-container page-leaderboard">
      {/* Hero de Clasificación Mundial */}
      <div className="instructions-hero">
        <div className="hero-badge">
          <Globe size={16} className="icon-blue" />
          <span>Ranking de Entrenadores</span>
        </div>
        <h1 className="hero-title">
          Clasificación <span className="gradient-text">Mundial</span>
        </h1>
        <p className="hero-subtitle">
          Consulta las mejores puntuaciones obtenidas en la arena de supervivencia infinita.
          Los récords son evaluados y registrados independientemente por generación y dificultad.
        </p>
      </div>

      {/* Récords Máximos Destacados */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-green">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Principiante (Gen 1)</span>
            <span className="admin-stat-val">{records.beginner} pts</span>
            <span className="admin-stat-trend">Kanto • 5 vidas</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Avanzado (Gen 2)</span>
            <span className="admin-stat-val">{records.advanced} pts</span>
            <span className="admin-stat-trend">Johto • 4 vidas</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-red">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Maestro (Gen 3)</span>
            <span className="admin-stat-val">{records.master} pts</span>
            <span className="admin-stat-trend">Hoenn • 3 vidas</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Filtrado */}
      <div className="leaderboard-filter-tabs">
        <button
          type="button"
          className={`tab-btn-leaderboard ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <Trophy size={16} />
          <span>Clasificación General</span>
        </button>

        <button
          type="button"
          className={`tab-btn-leaderboard ${activeFilter === 'principiante' ? 'active' : ''}`}
          onClick={() => setActiveFilter('principiante')}
        >
          <span>Principiante (Gen 1)</span>
        </button>

        <button
          type="button"
          className={`tab-btn-leaderboard ${activeFilter === 'avanzado' ? 'active' : ''}`}
          onClick={() => setActiveFilter('avanzado')}
        >
          <span>Avanzado (Gen 2)</span>
        </button>

        <button
          type="button"
          className={`tab-btn-leaderboard ${activeFilter === 'maestro' ? 'active' : ''}`}
          onClick={() => setActiveFilter('maestro')}
        >
          <span>Maestro (Gen 3)</span>
        </button>
      </div>

      {/* Tabla de Clasificación */}
      <div className="leaderboard-section">
        {isLoading ? (
          <div className="loading-scores-state">
            <span className="spinner-mini"></span>
            <span>Cargando clasificación mundial...</span>
          </div>
        ) : filteredScores.length === 0 ? (
          <div className="empty-scores">
            <p>No hay puntuaciones registradas para este filtro todavía.</p>
            <Link to="/jugador" className="btn btn-primary btn-sm">
              Ser el Primero en Clasificar
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Entrenador</th>
                  <th>Dificultad</th>
                  <th>Puntos</th>
                  <th>Mejor Racha</th>
                  <th>Preguntas</th>
                  <th>Aciertos</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((item, index) => {
                  const isDemo = ['1', '2', '3'].includes(String(item.id));
                  return (
                    <tr key={item.id || index} className={index === 0 ? 'top-row' : ''}>
                      <td className="rank-cell">
                        {index === 0 ? (
                          <span className="rank-gold">🥇 1º</span>
                        ) : index === 1 ? (
                          <span className="rank-silver">🥈 2º</span>
                        ) : index === 2 ? (
                          <span className="rank-bronze">🥉 3º</span>
                        ) : (
                          <span>#{index + 1}</span>
                        )}
                      </td>
                      <td className="trainer-name">
                        <span className="trainer-avatar-mini-initial">
                          {item.playerName ? item.playerName.charAt(0) : 'E'}
                        </span>
                        <strong>{item.playerName}</strong>
                        {isDemo && <span className="demo-data-badge">Ejemplo</span>}
                      </td>
                      <td>
                        <span className={`level-pill pill-${item.difficulty || item.level || 'principiante'}`}>
                          {item.difficulty || item.level} (Gen {item.generation || 1})
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
                      <td className="text-success font-bold">
                        {item.correctAnswers ?? 0}
                      </td>
                      <td className="date-cell">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Reciente'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="result-actions mt-4 text-center">
        <Link to="/jugador" className="btn btn-primary btn-lg">
          <Gamepad2 size={18} />
          <span>Iniciar Nueva Supervivencia</span>
        </Link>
      </div>
    </div>
  );
};
