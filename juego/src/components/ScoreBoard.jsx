import React from 'react';
import { Award, Zap, Flame, ShieldAlert } from 'lucide-react';
import { getStreakMultiplier, getProgressiveDifficultyStage } from '../utils/helpers';

export const ScoreBoard = ({
  score = 0,
  currentQuestionNumber = 1,
  currentStreak = 0,
  bestStreak = 0
}) => {
  const multiplier = getStreakMultiplier(currentStreak);
  const stage = getProgressiveDifficultyStage(currentQuestionNumber);

  return (
    <div className="scoreboard-panel">
      {/* Puntuación */}
      <div className="scoreboard-item score-main">
        <Award className="score-icon" size={22} />
        <div>
          <span className="score-label">Puntaje</span>
          <span className="score-value">{score} pts</span>
        </div>
      </div>

      {/* Racha y Multiplicador */}
      <div className="scoreboard-item streak-item">
        <Flame className="streak-icon" size={20} />
        <div>
          <span className="score-label">Racha: {currentStreak}</span>
          <span className="streak-max-label">Mejor: {bestStreak}</span>
        </div>
        {multiplier > 1 && (
          <div className="multiplier-badge animate-pulse" title={`Multiplicador de racha: x${multiplier}`}>
            <Zap size={14} />
            <span>x{multiplier}</span>
          </div>
        )}
      </div>

      {/* Contador continuo de supervivencia */}
      <div className="scoreboard-item progress-item">
        <div>
          <span className="score-label">Supervivencia</span>
          <span className="progress-value">Pregunta #{currentQuestionNumber}</span>
        </div>
        <span className="difficulty-stage-pill" style={{ borderColor: stage.color, color: stage.color }}>
          {stage.level}
        </span>
      </div>
    </div>
  );
};
