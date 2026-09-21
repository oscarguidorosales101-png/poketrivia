import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateSurvivalBatch } from '../services/pokemonService';
import {
  LEVEL_CONFIG,
  calculatePointsEarned,
  getStreakMultiplier
} from '../utils/helpers';
import { useGameTimer } from '../hooks/useGameTimer';
import { useAuth } from '../hooks/useAuth';
import { saveScore, checkAndUpdateRecord, getRecords } from '../services/scoreService';
import { sendGameResultToN8N } from '../services/n8nService';
import { updateUserHints, recordUserMatchStats } from '../services/authService';
import { AlertTriangle } from 'lucide-react';

import { GameBoard } from '../components/GameBoard';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import { GameOverModal } from '../components/GameOverModal';

export const Game = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Validar nivel de dificultad (soporta principiante, avanzado, maestro y aliases)
  const levelKey = LEVEL_CONFIG[nivel] ? nivel : 'principiante';
  const currentLevelConfig = LEVEL_CONFIG[levelKey];

  // ==========================================
  // ESTADOS CON useState
  // ==========================================
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(currentLevelConfig.lives);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(() => user?.hints ?? 5);

  // Estados de la pregunta activa
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Pistas aplicadas a la pregunta actual
  const [hintsUsedOnQuestion, setHintsUsedOnQuestion] = useState(0);
  const [is5050Used, setIs5050Used] = useState(false);
  const [isFeatureUsed, setIsFeatureUsed] = useState(false);
  const [isTextUsed, setIsTextUsed] = useState(false);
  const [disabledOptionIds, setDisabledOptionIds] = useState([]);

  // Métricas acumuladas de la partida
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  const [totalHintsUsedInMatch, setTotalHintsUsedInMatch] = useState(0);

  // Estado de fin de juego (Game Over) y modal de confirmación de salida
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewRecordAchieved, setIsNewRecordAchieved] = useState(false);
  const [difficultyHighScore, setDifficultyHighScore] = useState(0);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  const isPrefetchingRef = useRef(false);
  const hasEndedRef = useRef(false);
  const usedQuestionKeysRef = useRef(new Set());

  const currentQuestion = questions[currentQuestionIndex] || null;
  const currentQuestionNumber = currentQuestionIndex + 1;

  // Cargar el récord actual de esta dificultad
  useEffect(() => {
    getRecords().then((rec) => {
      setDifficultyHighScore(Number(rec[currentLevelConfig.recordKey]) || 0);
    });
  }, [currentLevelConfig.recordKey]);

  // ==========================================
  // MANEJO DE TIEMPO AGOTADO
  // ==========================================
  const handleTimeOut = useCallback(() => {
    if (isRevealed || isGameOver) return;
    setIsRevealed(true);
    setIncorrectAnswersCount((prev) => prev + 1);
    setCurrentStreak(0);
    setLives((prev) => Math.max(0, prev - 1));
  }, [isRevealed, isGameOver]);

  const { timeLeft, startTimer, stopTimer, resetTimer } = useGameTimer(
    currentLevelConfig.timePerQuestion,
    handleTimeOut
  );

  // ==========================================
  // CARGA INICIAL DE PREGUNTAS (useEffect)
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);
    hasEndedRef.current = false;
    usedQuestionKeysRef.current = new Set();

    generateSurvivalBatch(levelKey, 1, 6, controller.signal, usedQuestionKeysRef.current)
      .then((data) => {
        if (!isMounted || !data || data.length === 0) return;
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setScore(0);
        setLives(currentLevelConfig.lives);
        setCurrentStreak(0);
        setBestStreak(0);
        setCorrectAnswersCount(0);
        setIncorrectAnswersCount(0);
        setTotalHintsUsedInMatch(0);
        setSelectedOption(null);
        setIsRevealed(false);
        setIsGameOver(false);
        setIsLoading(false);
        startTimer(currentLevelConfig.timePerQuestion);
      })
      .catch((err) => {
        if (!isMounted || err.name === 'AbortError') return;
        setErrorMessage('Error de conexión con PokeAPI. Por favor verifica tu acceso.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
      stopTimer();
    };
  }, [levelKey, currentLevelConfig.lives, currentLevelConfig.timePerQuestion]);

  // ==========================================
  // PREFETCH INFINITO DE PREGUNTAS
  // ==========================================
  useEffect(() => {
    // Cuando quedan pocas preguntas en la lista, prefetch de 5 más sin repetir
    if (questions.length > 0 && currentQuestionIndex >= questions.length - 2 && !isPrefetchingRef.current) {
      isPrefetchingRef.current = true;
      const nextBatchStartIndex = questions.length + 1;

      generateSurvivalBatch(levelKey, nextBatchStartIndex, 5, null, usedQuestionKeysRef.current)
        .then((nextBatch) => {
          if (nextBatch && nextBatch.length > 0) {
            setQuestions((prev) => [...prev, ...nextBatch]);
          }
          isPrefetchingRef.current = false;
        })
        .catch(() => {
          isPrefetchingRef.current = false;
        });
    }
  }, [currentQuestionIndex, questions.length, levelKey]);

  // ==========================================
  // FIN DE PARTIDA / GAME OVER
  // ==========================================
  const triggerGameOver = useCallback(async () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    stopTimer();

    // 1. Comprobar y actualizar récord independiente
    const recordResult = await checkAndUpdateRecord(currentLevelConfig.recordKey, score);
    setIsNewRecordAchieved(recordResult.isNewRecord);
    setDifficultyHighScore(recordResult.currentHigh);

    // 2. Guardar en db.json mediante POST
    const matchPayload = {
      playerId: user?.id || 'usr-player',
      playerName: user?.name || user?.username || 'Entrenador',
      difficulty: levelKey,
      generation: currentLevelConfig.generation,
      score,
      questionsAnswered: currentQuestionNumber,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectAnswersCount + (lives === 0 ? 1 : 0),
      bestStreak,
      hintsUsed: totalHintsUsedInMatch,
      remainingLives: 0,
      isNewRecord: recordResult.isNewRecord,
      date: new Date().toISOString()
    };

    saveScore(matchPayload);

    // Acumular estadísticas al perfil del jugador
    if (user?.id) {
      recordUserMatchStats(user.id, matchPayload);
    }

    // 3. Comunicar con n8n
    sendGameResultToN8N(matchPayload);

    setIsGameOver(true);
  }, [
    stopTimer,
    currentLevelConfig.recordKey,
    currentLevelConfig.generation,
    score,
    user,
    levelKey,
    currentQuestionNumber,
    correctAnswersCount,
    incorrectAnswersCount,
    lives,
    bestStreak,
    totalHintsUsedInMatch
  ]);

  // Detectar fin de vidas
  useEffect(() => {
    if (!isLoading && lives === 0 && isRevealed && !isGameOver) {
      const timeout = setTimeout(() => {
        triggerGameOver();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [lives, isRevealed, isLoading, isGameOver, triggerGameOver]);

  // ==========================================
  // RESPUESTA SELECCIONADA (useCallback)
  // ==========================================
  const handleSelectOption = useCallback(
    (option) => {
      if (isRevealed || isGameOver) return;

      stopTimer();
      setSelectedOption(option);
      setIsRevealed(true);

      if (option.isCorrect) {
        const nextStreak = currentStreak + 1;
        setCurrentStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));

        // Puntos calculados con penalización de pistas y multiplicador
        const earned = calculatePointsEarned(
          currentLevelConfig.basePoints,
          hintsUsedOnQuestion,
          nextStreak
        );

        setScore((prev) => prev + earned);
        setCorrectAnswersCount((prev) => prev + 1);
      } else {
        setCurrentStreak(0);
        setLives((prev) => Math.max(0, prev - 1));
        setIncorrectAnswersCount((prev) => prev + 1);
      }
    },
    [
      isRevealed,
      isGameOver,
      stopTimer,
      currentStreak,
      currentLevelConfig.basePoints,
      hintsUsedOnQuestion
    ]
  );

  // ==========================================
  // AVANZAR A LA SIGUIENTE PREGUNTA
  // ==========================================
  const handleNextQuestion = useCallback(() => {
    if (lives <= 0) {
      triggerGameOver();
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setSelectedOption(null);
    setIsRevealed(false);

    // Resetear pistas de la pregunta
    setHintsUsedOnQuestion(0);
    setIs5050Used(false);
    setIsFeatureUsed(false);
    setIsTextUsed(false);
    setDisabledOptionIds([]);

    resetTimer(currentLevelConfig.timePerQuestion);
    startTimer(currentLevelConfig.timePerQuestion);
  }, [
    lives,
    currentQuestionIndex,
    triggerGameOver,
    resetTimer,
    startTimer,
    currentLevelConfig.timePerQuestion
  ]);

  // ==========================================
  // SISTEMA DE PISTAS
  // ==========================================
  const consumeHint = () => {
    if (hintsRemaining <= 0) return false;
    const nextCount = hintsRemaining - 1;
    setHintsRemaining(nextCount);
    setHintsUsedOnQuestion((prev) => prev + 1);
    setTotalHintsUsedInMatch((prev) => prev + 1);
    if (user?.id) {
      updateUserHints(user.id, nextCount);
    }
    return true;
  };

  // Pista 1: Descarte 50/50
  const handleUseHint5050 = () => {
    if (is5050Used || !currentQuestion || isRevealed) return;
    if (!consumeHint()) return;

    setIs5050Used(true);
    // Buscar una opción incorrecta que aún no esté descartada
    const incorrectOptions = currentQuestion.options.filter((o) => !o.isCorrect);
    if (incorrectOptions.length > 0) {
      const optionToDisable = incorrectOptions[0].id;
      setDisabledOptionIds((prev) => [...prev, optionToDisable]);
    }
  };

  // Pista 2: Revelar Atributo
  const handleUseHintFeature = () => {
    if (isFeatureUsed || isRevealed) return;
    if (!consumeHint()) return;
    setIsFeatureUsed(true);
  };

  // Pista 3: Pista Textual
  const handleUseHintText = () => {
    if (isTextUsed || isRevealed) return;
    if (!consumeHint()) return;
    setIsTextUsed(true);
  };

  // Reiniciar partida de nuevo
  const handlePlayAgain = () => {
    hasEndedRef.current = false;
    setIsGameOver(false);
    setIsLoading(true);

    generateSurvivalBatch(levelKey, 1, 6).then((data) => {
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setLives(currentLevelConfig.lives);
      setCurrentStreak(0);
      setBestStreak(0);
      setCorrectAnswersCount(0);
      setIncorrectAnswersCount(0);
      setTotalHintsUsedInMatch(0);
      setSelectedOption(null);
      setIsRevealed(false);
      setHintsUsedOnQuestion(0);
      setIs5050Used(false);
      setIsFeatureUsed(false);
      setIsTextUsed(false);
      setDisabledOptionIds([]);
      setIsLoading(false);
      resetTimer(currentLevelConfig.timePerQuestion);
      startTimer(currentLevelConfig.timePerQuestion);
    });
  };

  const handleReturnMenu = () => {
    navigate('/jugador');
  };

  const handleViewResults = () => {
    navigate('/resultados');
  };

  // ==========================================
  // SALIDA VOLUNTARIA CON CONFIRMACIÓN
  // ==========================================
  const handleRequestExit = () => {
    stopTimer();
    setShowExitConfirmModal(true);
  };

  const handleCancelExit = () => {
    setShowExitConfirmModal(false);
    if (!isRevealed && !isGameOver && lives > 0) {
      startTimer(timeLeft);
    }
  };

  const handleConfirmExit = async () => {
    setShowExitConfirmModal(false);
    stopTimer();
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    // 1. Comprobar récord si aplica
    const recordResult = await checkAndUpdateRecord(currentLevelConfig.recordKey, score);

    // 2. Guardar partida en db.json
    const matchPayload = {
      playerId: user?.id || 'usr-player',
      playerName: user?.name || user?.username || 'Entrenador',
      difficulty: levelKey,
      generation: currentLevelConfig.generation,
      score,
      questionsAnswered: currentQuestionNumber,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectAnswersCount,
      bestStreak,
      hintsUsed: totalHintsUsedInMatch,
      remainingLives: lives,
      isNewRecord: recordResult.isNewRecord,
      date: new Date().toISOString()
    };

    saveScore(matchPayload);

    // 3. Acumular estadísticas al perfil del jugador
    if (user?.id) {
      recordUserMatchStats(user.id, matchPayload);
    }

    // 4. Enviar a n8n
    sendGameResultToN8N(matchPayload);

    navigate('/jugador');
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingState message={`Iniciando partida de supervivencia (${currentLevelConfig.name})...`} />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page-container">
        <ErrorMessage
          title="Error en PokeAPI"
          message={errorMessage}
          onRetry={() => window.location.reload()}
          retryText="Reintentar"
        />
      </div>
    );
  }

  return (
    <div className="page-container page-game">
      <GameBoard
        levelConfig={currentLevelConfig}
        question={currentQuestion}
        lives={lives}
        score={score}
        timeLeft={timeLeft}
        currentQuestionNumber={currentQuestionNumber}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        selectedOption={selectedOption}
        isRevealed={isRevealed}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNextQuestion}
        onExitGame={handleRequestExit}
        // Props de pistas
        hintsRemaining={hintsRemaining}
        hintsUsedOnCurrentQuestion={hintsUsedOnQuestion}
        onUseHint5050={handleUseHint5050}
        onUseHintFeature={handleUseHintFeature}
        onUseHintText={handleUseHintText}
        is5050Used={is5050Used}
        isFeatureUsed={isFeatureUsed}
        isTextUsed={isTextUsed}
        disabledOptionIds={disabledOptionIds}
      />

      {/* Modal Game Over */}
      {isGameOver && (
        <GameOverModal
          score={score}
          bestStreak={bestStreak}
          questionsAnswered={currentQuestionNumber}
          correctAnswers={correctAnswersCount}
          incorrectAnswers={incorrectAnswersCount}
          hintsUsed={totalHintsUsedInMatch}
          currentRecord={difficultyHighScore}
          isNewRecord={isNewRecordAchieved}
          onPlayAgain={handlePlayAgain}
          onReturnMenu={handleReturnMenu}
          onViewResults={handleViewResults}
        />
      )}

      {/* Modal de Confirmación para Salir de la Partida */}
      {showExitConfirmModal && (
        <div className="confirm-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
          <div className="confirm-modal-card">
            <div className="confirm-modal-header">
              <div className="confirm-icon-box danger">
                <AlertTriangle size={24} />
              </div>
              <h3 className="confirm-modal-title">¿Abandonar la partida?</h3>
            </div>

            <div className="confirm-modal-body">
              <p>
                Al salir, la partida actual terminará. <strong>Se guardará tu puntuación actual ({score} pts)</strong> y
                las estadísticas conseguidas en tu perfil, pero no podrás reanudar esta partida desde este punto.
              </p>
            </div>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={handleCancelExit}
              >
                Continuar jugando
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleConfirmExit}
              >
                Salir y guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
