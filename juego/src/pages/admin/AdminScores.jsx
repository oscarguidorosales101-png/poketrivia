import React, { useState, useEffect } from 'react';
import { getScores, getRecords } from '../../services/scoreService';
import { Trophy, Award, Search, Database } from 'lucide-react';

export const AdminScores = () => {
  const [scores, setScores] = useState([]);
  const [records, setRecords] = useState({ beginner: 0, advanced: 0, master: 0 });

  useEffect(() => {
    Promise.all([getScores(), getRecords()]).then(([scoresData, recs]) => {
      setScores(scoresData.scores || []);
      setRecords(recs);
    });
  }, []);

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Puntuaciones y Récords Globales</h1>
          <p className="admin-page-sub">
            Histórico detallado de todas las partidas jugadas en la arena de supervivencia.
          </p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-green">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Principiante</span>
            <span className="admin-stat-val">{records.beginner} pts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Avanzado</span>
            <span className="admin-stat-val">{records.advanced} pts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-red">
            <Trophy size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Récord Maestro</span>
            <span className="admin-stat-val">{records.master} pts</span>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Partida</th>
              <th>Entrenador</th>
              <th>Dificultad</th>
              <th>Puntaje</th>
              <th>Racha Máx.</th>
              <th>Preguntas</th>
              <th>Aciertos</th>
              <th>Errores</th>
              <th>Pistas</th>
              <th>Récord Nuevo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s) => (
              <tr key={s.id}>
                <td className="font-mono text-muted">{s.id.slice(0, 8)}...</td>
                <td className="font-bold">{s.playerName}</td>
                <td>
                  <span className={`level-pill pill-${s.difficulty}`}>
                    {s.difficulty}
                  </span>
                </td>
                <td className="score-cell">{s.score} pts</td>
                <td className="font-bold">{s.bestStreak || 0}</td>
                <td>{s.questionsAnswered || s.correctAnswers || 0}</td>
                <td className="text-success font-bold">{s.correctAnswers}</td>
                <td className="text-error font-bold">{s.incorrectAnswers}</td>
                <td>{s.hintsUsed || 0}</td>
                <td>
                  {s.isNewRecord ? (
                    <span className="badge-new-rec">★ Nuevo</span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td className="date-cell">
                  {s.date ? new Date(s.date).toLocaleDateString() : 'Reciente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
