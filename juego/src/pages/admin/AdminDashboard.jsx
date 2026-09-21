import React, { useState, useEffect } from 'react';
import { getScores, getRecords } from '../../services/scoreService';
import {
  Users,
  HelpCircle,
  Trophy,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const [scoresData, setScoresData] = useState([]);
  const [records, setRecords] = useState({ beginner: 0, advanced: 0, master: 0 });

  useEffect(() => {
    Promise.all([getScores(), getRecords()]).then(([scoresRes, recs]) => {
      setScoresData(scoresRes.scores || []);
      setRecords(recs);
    });
  }, []);

  const totalMatches = scoresData.length;
  const totalCorrect = scoresData.reduce((acc, m) => acc + (m.correctAnswers || 0), 0);
  const totalIncorrect = scoresData.reduce((acc, m) => acc + (m.incorrectAnswers || 0), 0);
  const totalHints = scoresData.reduce((acc, m) => acc + (m.hintsUsed || 0), 0);
  const accuracyRate = totalCorrect + totalIncorrect > 0
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
    : 0;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Administrativo</h1>
          <p className="admin-page-sub">Métricas globales y analíticas de la arena de supervivencia PokéTrivia.</p>
        </div>
      </div>

      {/* Rejilla de Tarjetas de Métricas */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-blue">
            <Users size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Jugadores Registrados</span>
            <span className="admin-stat-val">3 Entrenadores</span>
            <span className="admin-stat-trend text-success">2 con Pase Premium activo</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-purple">
            <HelpCircle size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Catálogo PokeAPI</span>
            <span className="admin-stat-val">386 Pokémon</span>
            <span className="admin-stat-trend">Gens 1, 2 y 3 habilitadas</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <Trophy size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Maestro</span>
            <span className="admin-stat-val">{records.master} pts</span>
            <span className="admin-stat-trend">Avanzado: {records.advanced} pts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-green">
            <Activity size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Partidas Jugadas</span>
            <span className="admin-stat-val">{totalMatches} partidas</span>
            <span className="admin-stat-trend text-success">Tasa global de acierto: {accuracyRate}%</span>
          </div>
        </div>
      </div>

      {/* Gráficos y Distribución de Generaciones */}
      <div className="admin-panels-row">
        <div className="admin-panel-box">
          <h3 className="panel-box-title">
            <Layers size={18} />
            <span>Distribución de Pokémon por Generación</span>
          </h3>

          <div className="gen-distribution-bars">
            <div className="dist-bar-item">
              <div className="dist-label-row">
                <span>Generación 1 (Kanto - Principiante)</span>
                <strong>151 Pokémon (39%)</strong>
              </div>
              <div className="dist-progress-track">
                <div className="dist-progress-fill fill-kanto" style={{ width: '39%' }}></div>
              </div>
            </div>

            <div className="dist-bar-item">
              <div className="dist-label-row">
                <span>Generación 2 (Johto - Avanzado)</span>
                <strong>100 Pokémon (26%)</strong>
              </div>
              <div className="dist-progress-track">
                <div className="dist-progress-fill fill-johto" style={{ width: '26%' }}></div>
              </div>
            </div>

            <div className="dist-bar-item">
              <div className="dist-label-row">
                <span>Generación 3 (Hoenn - Maestro)</span>
                <strong>135 Pokémon (35%)</strong>
              </div>
              <div className="dist-progress-track">
                <div className="dist-progress-fill fill-hoenn" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Pistas y Suscripciones */}
        <div className="admin-panel-box">
          <h3 className="panel-box-title">
            <Sparkles size={18} />
            <span>Métricas de Pistas y Suscripciones</span>
          </h3>

          <div className="hints-summary-stats">
            <div className="hint-metric-box">
              <span className="hm-label">Pistas Consumidas en Partidas</span>
              <span className="hm-val">{totalHints}</span>
            </div>
            <div className="hint-metric-box">
              <span className="hm-label">Pase Maestro (2 meses)</span>
              <span className="hm-val text-gold">65 activos</span>
            </div>
            <div className="hint-metric-box">
              <span className="hm-label">Pase Élite (1.5 meses)</span>
              <span className="hm-val text-blue">28 activos</span>
            </div>
            <div className="hint-metric-box">
              <span className="hm-label">Pase Mensual (1 mes)</span>
              <span className="hm-val text-green">42 activos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
