import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook personalizado para gestionar el temporizador regresivo de cada pregunta.
 * 
 * JUSTIFICACIÓN TÉCNICA DE HOOKS ADICIONALES:
 * - useRef: Se utiliza para guardar la referencia del identificador devuelto por `setInterval`
 *   (`intervalRef.current`). Permite persistir la referencia mutable del temporizador a lo largo
 *   de sucesivos renderizados sin provocar re-renders innecesarios y garantizando que el cleanup
 *   limpie exactamente el intervalo activo sin pérdidas de memoria.
 * - useCallback: Se utiliza para memoizar las funciones `startTimer`, `stopTimer` y `resetTimer`.
 *   Esto previene que se recreen en cada render, permitiendo pasarlas de forma segura como
 *   dependencias en useEffects o como props a componentes hijos.
 */
export const useGameTimer = (initialSeconds = 15, onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // useRef almacena el ID del intervalo sin forzar re-renders del componente
  const intervalRef = useRef(null);
  // useRef para mantener actualizada la referencia al callback onTimeout
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // useCallback memoiza la detención del temporizador
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // useCallback memoiza el reinicio con nuevos segundos
  const resetTimer = useCallback((newSeconds) => {
    stopTimer();
    const duration = typeof newSeconds === 'number' ? newSeconds : initialSeconds;
    setTimeLeft(duration);
  }, [initialSeconds, stopTimer]);

  // useCallback memoiza el inicio del conteo regresivo
  const startTimer = useCallback((seconds) => {
    stopTimer();
    const startValue = typeof seconds === 'number' ? seconds : initialSeconds;
    setTimeLeft(startValue);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          if (onTimeoutRef.current) {
            onTimeoutRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialSeconds, stopTimer]);

  // Cleanup automático al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
};
