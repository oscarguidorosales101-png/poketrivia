export const DEFAULT_WEBHOOK_URL = 'http://localhost:5678/webhook/poketrivia/resultados';
const N8N_URL_STORAGE_KEY = 'poketrivia_n8n_url';

/**
 * Obtiene la URL configurada del webhook de n8n
 */
export const getN8nWebhookUrl = () => {
  try {
    const stored = localStorage.getItem(N8N_URL_STORAGE_KEY);
    if (
      stored &&
      stored.trim() &&
      !stored.includes('/webhook-test/') &&
      !stored.includes('pokemon-quiz-result')
    ) {
      return stored.trim();
    }
    // Si tenía una URL antigua de test o desactualizada, limpiar localStorage
    if (stored && (stored.includes('/webhook-test/') || stored.includes('pokemon-quiz-result'))) {
      localStorage.removeItem(N8N_URL_STORAGE_KEY);
    }
  } catch (e) {
    // localStorage no disponible en entornos aislados
  }
  return DEFAULT_WEBHOOK_URL;
};

/**
 * Guarda una URL personalizada para el webhook de n8n
 */
export const setN8nWebhookUrl = (url) => {
  if (url && typeof url === 'string') {
    try {
      localStorage.setItem(N8N_URL_STORAGE_KEY, url.trim());
    } catch (e) {
      // localStorage no disponible
    }
  }
};

/**
 * Construye el payload estandarizado para n8n con los datos reales de la partida y cuenta activa
 */
export const buildN8nPayload = (gameResult) => {
  const subValue = typeof gameResult.subscription === 'object' && gameResult.subscription !== null
    ? (gameResult.subscription.type || 'free')
    : (gameResult.subscription || 'free');

  return {
    playerId: gameResult.playerId ? String(gameResult.playerId).trim() : 'usr-anon',
    username: gameResult.username ? String(gameResult.username).trim() : (gameResult.playerName ? String(gameResult.playerName).trim() : 'entrenador'),
    difficulty: gameResult.difficulty ? String(gameResult.difficulty).toLowerCase() : (gameResult.level ? String(gameResult.level).toLowerCase() : 'principiante'),
    generation: Number(gameResult.generation) || 1,
    score: Number(gameResult.score) || 0,
    correctAnswers: Number(gameResult.correctAnswers) || 0,
    incorrectAnswers: Number(gameResult.incorrectAnswers) || 0,
    questionsAnswered: Number(gameResult.questionsAnswered) !== undefined && !Number.isNaN(Number(gameResult.questionsAnswered))
      ? Number(gameResult.questionsAnswered)
      : (Number(gameResult.correctAnswers || 0) + Number(gameResult.incorrectAnswers || 0)),
    bestStreak: Number(gameResult.bestStreak) || 0,
    hintsUsed: Number(gameResult.hintsUsed) || 0,
    isNewRecord: Boolean(gameResult.isNewRecord),
    subscription: String(subValue).toLowerCase(),
    date: gameResult.date || new Date().toISOString()
  };
};

/**
 * Envía el resultado final de la partida al webhook de n8n mediante fetch POST
 * No bloquea la partida si n8n no está levantado o responde con error.
 */
export const sendGameResultToN8N = async (gameResult, customUrl) => {
  const targetUrl = customUrl || getN8nWebhookUrl();
  const payload = buildN8nPayload(gameResult);

  const controller = new AbortController();
  // Timeout de 4 segundos para no dejar al usuario esperando si n8n no responde
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`El webhook de n8n respondió con error HTTP ${response.status}`);
    }

    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        responseData = { message: text || 'success' };
      }
    }

    console.log('✓ [n8n] Resultado de partida enviado exitosamente al webhook:', responseData);

    return {
      success: true,
      data: responseData,
      url: targetUrl,
      message: '¡Datos recibidos y validados exitosamente por el flujo de n8n!'
    };
  } catch (error) {
    clearTimeout(timeoutId);

    const isTimeout = error.name === 'AbortError';
    const message = isTimeout
      ? 'Tiempo de espera agotado al conectar con n8n (el servicio tardó más de 4s).'
      : `No se pudo contactar el webhook de n8n (${error.message}). La partida continúa guardada localmente.`;

    console.warn('⚠️ [n8n] No se pudo enviar el resultado a n8n (no bloqueante):', error.message);

    return {
      success: false,
      isOffline: true,
      error: error.message,
      url: targetUrl,
      message
    };
  }
};
