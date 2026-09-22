import { sendGameResultToN8N } from './n8nService.js';

const API_BASE = 'http://localhost:3001';
const API_SCORES_URL = `${API_BASE}/scores`;
const API_RECORDS_URL = `${API_BASE}/records`;
const LOCAL_STORAGE_SCORES_KEY = 'poketrivia_saved_scores';
const LOCAL_STORAGE_RECORDS_KEY = 'poketrivia_high_records';

const DEFAULT_RECORDS = {
  beginner: 500,
  advanced: 380,
  master: 500
};

const DEFAULT_SCORES = [
  {
    id: '1',
    playerId: 'usr-demo-red',
    playerName: 'Red',
    difficulty: 'maestro',
    generation: 3,
    score: 500,
    questionsAnswered: 5,
    correctAnswers: 5,
    incorrectAnswers: 0,
    bestStreak: 5,
    hintsUsed: 0,
    remainingLives: 3,
    date: '2026-09-20T14:32:00.000Z',
    isNewRecord: true
  },
  {
    id: '2',
    playerId: 'usr-demo-blue',
    playerName: 'Blue',
    difficulty: 'avanzado',
    generation: 2,
    score: 380,
    questionsAnswered: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    bestStreak: 4,
    hintsUsed: 1,
    remainingLives: 3,
    date: '2026-09-20T16:15:00.000Z',
    isNewRecord: true
  },
  {
    id: '3',
    playerId: 'usr-player-2',
    playerName: 'Misty Waterflower',
    difficulty: 'principiante',
    generation: 1,
    score: 300,
    questionsAnswered: 5,
    correctAnswers: 3,
    incorrectAnswers: 2,
    bestStreak: 3,
    hintsUsed: 2,
    remainingLives: 3,
    date: '2026-09-21T08:00:00.000Z',
    isNewRecord: false
  }
];

/**
 * Obtiene los récords independientes por dificultad (beginner, advanced, master)
 */
export const getRecords = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(API_RECORDS_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(data));
      return data;
    }
  } catch {}

  // Fallback local
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
    return local ? JSON.parse(local) : DEFAULT_RECORDS;
  } catch {
    return DEFAULT_RECORDS;
  }
};

/**
 * Comprueba y actualiza el récord independiente si el nuevo puntaje lo supera
 */
export const checkAndUpdateRecord = async (recordKey, newScore) => {
  const currentRecords = await getRecords();
  const previousHigh = Number(currentRecords[recordKey]) || 0;
  const numScore = Number(newScore) || 0;
  const isNewRecord = numScore > 0 && numScore > previousHigh;

  if (isNewRecord) {
    const updated = {
      ...currentRecords,
      [recordKey]: numScore
    };
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(updated));

    try {
      await fetch(API_RECORDS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {}

    return { isNewRecord: true, previousHigh, currentHigh: numScore };
  }

  return { isNewRecord: false, previousHigh, currentHigh: previousHigh };
};

/**
 * Obtiene el historial de partidas desde json-server o almacenamiento local
 */
export const getScores = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(API_SCORES_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        scores: Array.isArray(data) ? data.sort((a, b) => b.score - a.score) : [],
        source: 'server'
      };
    }
    throw new Error('Servidor retornó código no exitoso');
  } catch {
    clearTimeout(timeoutId);
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
      const parsed = localData ? JSON.parse(localData) : DEFAULT_SCORES;
      return {
        scores: parsed.sort((a, b) => b.score - a.score),
        source: 'local'
      };
    } catch {
      return { scores: DEFAULT_SCORES, source: 'default' };
    }
  }
};

/**
 * Obtiene el historial de partidas exclusivamente para un jugador específico
 */
export const getPlayerScores = async (playerId) => {
  if (!playerId) return [];
  const res = await getScores();
  return (res.scores || []).filter(
    (s) => s.playerId === playerId || s.userId === playerId
  );
};

/**
 * Guarda una partida de supervivencia mediante operación POST real en json-server
 * y despacha automáticamente el resultado al webhook de n8n de forma desacoplada y tolerante a fallos.
 */
export const saveScore = async (matchPayload) => {
  const newScore = {
    id: Date.now().toString(),
    playerId: matchPayload.playerId || 'usr-anon',
    username: matchPayload.username || matchPayload.playerName?.trim() || 'entrenador',
    playerName: matchPayload.playerName?.trim() || matchPayload.username || 'Entrenador Anónimo',
    difficulty: matchPayload.difficulty || matchPayload.level || 'principiante',
    generation: Number(matchPayload.generation) || 1,
    score: Number(matchPayload.score) || 0,
    questionsAnswered: Number(matchPayload.questionsAnswered) || (Number(matchPayload.correctAnswers) + Number(matchPayload.incorrectAnswers)) || 0,
    correctAnswers: Number(matchPayload.correctAnswers) || 0,
    incorrectAnswers: Number(matchPayload.incorrectAnswers) || 0,
    bestStreak: Number(matchPayload.bestStreak) || 0,
    hintsUsed: Number(matchPayload.hintsUsed) || 0,
    remainingLives: Number(matchPayload.remainingLives) || 0,
    isNewRecord: Boolean(matchPayload.isNewRecord),
    subscription: typeof matchPayload.subscription === 'object' && matchPayload.subscription !== null
      ? (matchPayload.subscription.type || 'free').toLowerCase()
      : String(matchPayload.subscription || 'free').toLowerCase(),
    date: matchPayload.date || new Date().toISOString()
  };

  let localResult = null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(API_SCORES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newScore),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const savedData = await response.json();
      saveToLocalStorage(savedData);
      localResult = {
        success: true,
        data: savedData,
        source: 'server',
        message: '¡Partida registrada en el servidor (db.json)!'
      };
    } else {
      throw new Error(`Respuesta del servidor: ${response.status}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    saveToLocalStorage(newScore);
    localResult = {
      success: true,
      data: newScore,
      source: 'local',
      message: 'Partida guardada localmente (inicia "npm run server" para sincronizar db.json)'
    };
  }

  // Despachar al webhook de n8n sin bloquear la aplicación si n8n no está en ejecución
  try {
    const n8nResult = await sendGameResultToN8N(newScore);
    localResult.n8n = n8nResult;
  } catch (n8nError) {
    console.warn('Transmisión a n8n no completada (no bloqueante):', n8nError?.message || n8nError);
    localResult.n8n = {
      success: false,
      isOffline: true,
      error: n8nError?.message
    };
  }

  return localResult;
};

const saveToLocalStorage = (scoreItem) => {
  try {
    if (typeof localStorage === 'undefined') return;
    const local = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
    const list = local ? JSON.parse(local) : [...DEFAULT_SCORES];
    list.unshift(scoreItem);
    localStorage.setItem(LOCAL_STORAGE_SCORES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error al guardar partida localmente:', e);
  }
};
