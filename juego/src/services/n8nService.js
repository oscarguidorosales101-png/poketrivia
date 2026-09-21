export const DEFAULT_WEBHOOK_URL = 'http://localhost:5678/webhook/pokemon-quiz-result';
const N8N_URL_STORAGE_KEY = 'poketrivia_n8n_url';

/**
 * Obtiene la URL configurada del webhook de n8n
 */
export const getN8nWebhookUrl = () => {
  return localStorage.getItem(N8N_URL_STORAGE_KEY) || DEFAULT_WEBHOOK_URL;
};

/**
 * Guarda una URL personalizada para el webhook de n8n
 */
export const setN8nWebhookUrl = (url) => {
  if (url && typeof url === 'string') {
    localStorage.setItem(N8N_URL_STORAGE_KEY, url.trim());
  }
};

/**
 * Envía el resultado final de la partida al workflow de n8n mediante fetch POST
 */
export const sendGameResultToN8N = async (gameResult, customUrl) => {
  const url = customUrl || getN8nWebhookUrl();

  const payload = {
    playerName: gameResult.playerName || 'Entrenador Anónimo',
    score: Number(gameResult.score) || 0,
    correctAnswers: Number(gameResult.correctAnswers) || 0,
    incorrectAnswers: Number(gameResult.incorrectAnswers) || 0,
    level: gameResult.level || 'facil',
    sentAt: new Date().toISOString()
  };

  const controller = new AbortController();
  // Timeout de 3.5 segundos para no dejar al usuario esperando si n8n no está levantado
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(url, {
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

    // Intentar leer la respuesta JSON devuelta por el nodo Respond to Webhook
    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { message: text || 'Respuesta recibida de n8n' };
    }

    return {
      success: true,
      data: responseData,
      url,
      message: '¡Datos recibidos y validados exitosamente por el flujo de n8n!'
    };
  } catch (error) {
    clearTimeout(timeoutId);

    const isTimeout = error.name === 'AbortError';
    const message = isTimeout
      ? 'Tiempo de espera agotado al conectar con n8n (el servicio tardó más de 3.5s).'
      : 'No se pudo contactar el webhook de n8n. Verifica que n8n esté corriendo en el puerto 5678.';

    return {
      success: false,
      isOffline: true,
      error: error.message,
      url,
      message
    };
  }
};
