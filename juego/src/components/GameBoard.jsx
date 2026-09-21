import React from 'react';
import { GameHeader } from './GameHeader';
import { QuestionCard } from './QuestionCard';
import { HintPanel } from './HintPanel';
import { ArrowRight, Flame } from 'lucide-react';

export const GameBoard = ({
  levelConfig,
  question,
  lives,
  score,
  timeLeft,
  currentQuestionNumber,
  currentStreak,
  bestStreak,
  selectedOption,
  isRevealed,
  onSelectOption,
  onNextQuestion,
  onExitGame,
  // Props de pistas
  hintsRemaining,
  hintsUsedOnCurrentQuestion,
  onUseHint5050,
  onUseHintFeature,
  onUseHintText,
  is5050Used,
  isFeatureUsed,
  isTextUsed,
  disabledOptionIds
}) => {
  return (
    <div className="game-board-container">
      {/* Cabecera HUD del juego */}
      <GameHeader
        levelBadge={levelConfig?.badge || 'Principiante'}
        generation={levelConfig?.generation || 1}
        lives={lives}
        maxLives={levelConfig?.lives || 5}
        timeLeft={timeLeft}
        score={score}
        currentQuestionNumber={currentQuestionNumber}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        onExitGame={onExitGame}
      />

      {/* Panel de pistas disponibles */}
      <HintPanel
        hintsRemaining={hintsRemaining}
        hintsUsedOnCurrentQuestion={hintsUsedOnCurrentQuestion}
        onUseHint5050={onUseHint5050}
        onUseHintFeature={onUseHintFeature}
        onUseHintText={onUseHintText}
        is5050Used={is5050Used}
        isFeatureUsed={isFeatureUsed}
        isTextUsed={isTextUsed}
        disabled={isRevealed}
      />

      {/* Tarjeta interactiva con la pregunta y opciones */}
      <QuestionCard
        question={question}
        selectedOption={selectedOption}
        isRevealed={isRevealed}
        onSelectOption={onSelectOption}
        disabled={isRevealed}
        disabledOptionIds={disabledOptionIds}
        revealedFeatures={isFeatureUsed}
        revealedTextClue={isTextUsed}
      />

      {/* Barra de acción cuando la respuesta ya fue revelada */}
      {isRevealed && (
        <div className="next-action-bar animate-slide-up">
          <button
            type="button"
            className="btn btn-action-next"
            onClick={onNextQuestion}
          >
            <span>Continuar a la Pregunta #{currentQuestionNumber + 1}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
