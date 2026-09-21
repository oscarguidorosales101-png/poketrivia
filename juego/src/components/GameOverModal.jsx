import React from 'react';
import { Skull, Trophy, RotateCcw, Home, Sparkles, CheckCircle2, XCircle, HelpCircle, Flame } from 'lucide-react';

export const GameOverModal = ({
  score = 0,
  bestStreak = 0,
  questionsAnswered = 0,
  correctAnswers = 0,
  incorrectAnswers = 0,
  hintsUsed = 0,
  currentRecord = 0,
  isNewRecord = false,
  onPlayAgain,
  onReturnMenu,
  onViewResults
}) => {
  return (
    <div className="game-over-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="game-over-card animate-slide-up">
        {/* Cabecera Game Over */}
        <div className="game-over-icon-wrapper">
          <Skull size={44} className="skull-icon" />
        </div>

        <h2 className="game-over-title">GAME OVER</h2>
        <p className="game-over-subtitle">Tus vidas se han agotado. La partida de supervivencia ha terminado.</p>

        {/* Banner de Nuevo Récord */}
        {isNewRecord && (
          <div className="new-record-banner animate-bounce">
            <Sparkles size={20} />
            <span>¡NUEVO RÉCORD CONSEGUIDO!</span>
            <Sparkles size={20} />
          </div>
        )}

        {/* Rejilla de Estadísticas de la Partida */}
        <div className="game-over-stats-grid">
          <div className="go-stat-item highlight">
            <span className="go-stat-label">Puntuación Final</span>
            <span className="go-stat-value">{score} pts</span>
          </div>

          <div className="go-stat-item record-item">
            <Trophy size={18} className="trophy-icon" />
            <div>
              <span className="go-stat-label">Récord Dificultad</span>
              <span className="go-stat-value">{currentRecord} pts</span>
            </div>
          </div>

          <div className="go-stat-item">
            <Flame size={18} className="flame-icon" />
            <div>
              <span className="go-stat-label">Racha Máxima</span>
              <span className="go-stat-value">{bestStreak} seguidas</span>
            </div>
          </div>

          <div className="go-stat-item">
            <span className="go-stat-label">Preguntas Totales</span>
            <span className="go-stat-value">{questionsAnswered}</span>
          </div>

          <div className="go-stat-item">
            <CheckCircle2 size={18} className="icon-correct" />
            <div>
              <span className="go-stat-label">Aciertos</span>
              <span className="go-stat-value text-success">{correctAnswers}</span>
            </div>
          </div>

          <div className="go-stat-item">
            <XCircle size={18} className="icon-error" />
            <div>
              <span className="go-stat-label">Errores</span>
              <span className="go-stat-value text-error">{incorrectAnswers}</span>
            </div>
          </div>

          <div className="go-stat-item">
            <HelpCircle size={18} />
            <div>
              <span className="go-stat-label">Pistas Utilizadas</span>
              <span className="go-stat-value">{hintsUsed}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="game-over-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={onPlayAgain}>
            <RotateCcw size={20} />
            <span>Jugar de Nuevo</span>
          </button>

          <button type="button" className="btn btn-secondary btn-lg" onClick={onReturnMenu}>
            <Home size={20} />
            <span>Volver al Menú</span>
          </button>

          {onViewResults && (
            <button type="button" className="btn btn-cancel-modal btn-lg" onClick={onViewResults}>
              <Trophy size={20} />
              <span>Ver Resultados</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
