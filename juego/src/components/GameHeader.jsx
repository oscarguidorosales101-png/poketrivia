import React from 'react';
import { Timer, Sparkles, LogOut } from 'lucide-react';
import { LivesDisplay } from './LivesDisplay';
import { ScoreBoard } from './ScoreBoard';

export const GameHeader = ({
  levelBadge = 'Principiante',
  generation = 1,
  lives = 5,
  maxLives = 5,
  timeLeft = 15,
  score = 0,
  currentQuestionNumber = 1,
  currentStreak = 0,
  bestStreak = 0,
  onExitGame
}) => {
  const isTimeCritical = timeLeft <= 4 && timeLeft > 0;

  return (
    <div className="game-header-hud">
      <div className="hud-top-bar">
        <div className="hud-difficulty-badge">
          <Sparkles size={16} />
          <span>Dificultad: {levelBadge} (Gen {generation})</span>
        </div>

        <div className={`hud-timer-badge ${isTimeCritical ? 'timer-critical' : ''}`}>
          <Timer size={18} className="timer-icon" />
          <span className="timer-seconds">{timeLeft}s</span>
        </div>

        <LivesDisplay lives={lives} maxLives={maxLives} />

        {onExitGame && (
          <button
            type="button"
            className="btn-exit-hud"
            onClick={onExitGame}
            title="Salir de la partida"
          >
            <LogOut size={15} />
            <span>Salir</span>
          </button>
        )}
      </div>

      <ScoreBoard
        score={score}
        currentQuestionNumber={currentQuestionNumber}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
      />
    </div>
  );
};
