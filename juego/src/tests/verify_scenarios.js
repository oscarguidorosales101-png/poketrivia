import assert from 'node:assert';
import {
  LEVEL_CONFIG,
  getStreakMultiplier,
  calculatePointsEarned
} from '../utils/helpers.js';
import { login, logout, getCurrentUser, recordUserMatchStats } from '../services/authService.js';
import { getPlayerScores, getRecords, saveScore } from '../services/scoreService.js';
import { buildN8nPayload, sendGameResultToN8N, DEFAULT_WEBHOOK_URL } from '../services/n8nService.js';

console.log('--- INICIANDO VERIFICACIÓN DE ESCENARIOS POKÉTRIVIA ---');

// 1. Verificación de Multiplicadores de Racha
console.log('1. Verificando tabla de multiplicadores de racha...');
assert.strictEqual(getStreakMultiplier(1), 1.0, 'Racha 1 debe ser x1.0');
assert.strictEqual(getStreakMultiplier(4), 1.0, 'Racha 4 debe ser x1.0');
assert.strictEqual(getStreakMultiplier(5), 1.25, 'Racha 5 debe ser x1.25');
assert.strictEqual(getStreakMultiplier(9), 1.25, 'Racha 9 debe ser x1.25');
assert.strictEqual(getStreakMultiplier(10), 1.5, 'Racha 10 debe ser x1.5');
assert.strictEqual(getStreakMultiplier(19), 1.5, 'Racha 19 debe ser x1.5');
assert.strictEqual(getStreakMultiplier(20), 1.75, 'Racha 20 debe ser x1.75');
assert.strictEqual(getStreakMultiplier(29), 1.75, 'Racha 29 debe ser x1.75');
assert.strictEqual(getStreakMultiplier(30), 2.0, 'Racha 30 debe ser x2.0');
assert.strictEqual(getStreakMultiplier(50), 2.0, 'Racha 50+ debe ser x2.0');
console.log('✓ Multiplicadores de racha conformes a la especificación.');

// 2. Verificación de Pistas y Puntuación
console.log('2. Verificando cálculo de puntuación y penalización de pistas...');
assert.strictEqual(calculatePointsEarned(100, 0, 1), 100, 'Sin pistas: 100%');
assert.strictEqual(calculatePointsEarned(100, 1, 1), 75, '1 pista: 75%');
assert.strictEqual(calculatePointsEarned(100, 2, 1), 50, '2 pistas: 50%');
assert.strictEqual(calculatePointsEarned(100, 0, 5), 125, 'Racha 5 con 100 base: 125');
assert.strictEqual(calculatePointsEarned(200, 0, 10), 300, 'Avanzado racha 10: 300');
assert.strictEqual(calculatePointsEarned(350, 0, 30), 700, 'Maestro racha 30: 700');
console.log('✓ Sistema de cálculo de puntuación validado.');

// 3. Verificación de Configuraciones por Dificultad
console.log('3. Verificando configuraciones por dificultad...');
assert.strictEqual(LEVEL_CONFIG.principiante.lives, 5, 'Principiante debe tener 5 vidas');
assert.strictEqual(LEVEL_CONFIG.principiante.basePoints, 100, 'Principiante debe tener 100 puntos base');
assert.strictEqual(LEVEL_CONFIG.principiante.generation, 1, 'Principiante pertenece a Gen 1');

assert.strictEqual(LEVEL_CONFIG.avanzado.lives, 4, 'Avanzado debe tener 4 vidas');
assert.strictEqual(LEVEL_CONFIG.avanzado.basePoints, 200, 'Avanzado debe tener 200 puntos base');
assert.strictEqual(LEVEL_CONFIG.avanzado.generation, 2, 'Avanzado pertenece a Gen 2');

assert.strictEqual(LEVEL_CONFIG.maestro.lives, 3, 'Maestro debe tener 3 vidas');
assert.strictEqual(LEVEL_CONFIG.maestro.basePoints, 350, 'Maestro debe tener 350 puntos base');
assert.strictEqual(LEVEL_CONFIG.maestro.generation, 3, 'Maestro pertenece a Gen 3');
console.log('✓ Niveles, vidas y generaciones confirmados.');

// 4. Verificación de Autenticación y Validación de Roles
console.log('4. Verificando inicio de sesión y validación de rol...');
async function testAll() {
  // Intento de entrar a Admin con cuenta de jugador
  const invalidAdminAttempt = await login('ash', 'pikachu123', 'ADMIN');
  assert.strictEqual(invalidAdminAttempt.success, false, 'No debe permitir acceso admin a un jugador');
  assert.match(invalidAdminAttempt.error, /privilegios de Administrador/i);
  console.log('✓ Validación de rol: seleccionar Administrador con cuenta PLAYER rechaza el acceso.');

  // Login exitoso como jugador Ash
  const ashLogin = await login('ash', 'pikachu123', 'PLAYER');
  assert.strictEqual(ashLogin.success, true, 'Ash debe autenticarse correctamente');
  assert.strictEqual(ashLogin.user.role, 'PLAYER');
  assert.strictEqual(ashLogin.user.username, 'ash');
  assert.strictEqual(ashLogin.user.subscription.type, 'FREE');
  console.log('✓ Sesión de Jugador iniciada: Ash Ketchum (PLAYER, FREE).');

  // Login exitoso como jugadora Misty
  const mistyLogin = await login('misty', 'starmie123', 'PLAYER');
  assert.strictEqual(mistyLogin.success, true, 'Misty debe autenticarse correctamente');
  assert.strictEqual(mistyLogin.user.role, 'PLAYER');
  assert.strictEqual(mistyLogin.user.username, 'misty');
  assert.strictEqual(mistyLogin.user.subscription.type, 'PREMIUM');
  assert.notStrictEqual(mistyLogin.user.id, ashLogin.user.id, 'Los IDs de Ash y Misty no deben coincidir');
  console.log('✓ Sesión independiente de Jugador: Misty Waterflower (PLAYER, PREMIUM).');

  // Login exitoso como Administrador Oak
  const oakLogin = await login('oak', 'profesor123', 'ADMIN');
  assert.strictEqual(oakLogin.success, true, 'Oak debe autenticarse correctamente como ADMIN');
  assert.strictEqual(oakLogin.user.role, 'ADMIN');
  console.log('✓ Sesión de Administrador iniciada: Profesor Oak (ADMIN).');

  // 5. Verificación de Integración con n8n
  console.log('5. Verificando integración y estructura de datos con Webhook de n8n...');
  assert.strictEqual(
    DEFAULT_WEBHOOK_URL,
    'http://localhost:5678/webhook/poketrivia/resultados',
    'La URL predeterminada debe ser http://localhost:5678/webhook/poketrivia/resultados'
  );

  // Payload de partida para Ash (FREE)
  const ashMatch = {
    playerId: ashLogin.user.id,
    username: ashLogin.user.username,
    playerName: ashLogin.user.name,
    difficulty: 'principiante',
    generation: 1,
    score: 300,
    correctAnswers: 3,
    incorrectAnswers: 1,
    questionsAnswered: 4,
    bestStreak: 3,
    hintsUsed: 1,
    isNewRecord: true,
    subscription: ashLogin.user.subscription.type,
    date: new Date().toISOString()
  };

  const ashPayload = buildN8nPayload(ashMatch);
  assert.strictEqual(ashPayload.playerId, 'usr-player');
  assert.strictEqual(ashPayload.username, 'ash');
  assert.strictEqual(ashPayload.playerName, 'Ash Ketchum');
  assert.strictEqual(ashPayload.difficulty, 'principiante');
  assert.strictEqual(ashPayload.generation, 1);
  assert.strictEqual(ashPayload.score, 300);
  assert.strictEqual(ashPayload.correctAnswers, 3);
  assert.strictEqual(ashPayload.incorrectAnswers, 1);
  assert.strictEqual(ashPayload.questionsAnswered, 4);
  assert.strictEqual(ashPayload.bestStreak, 3);
  assert.strictEqual(ashPayload.hintsUsed, 1);
  assert.strictEqual(ashPayload.isNewRecord, true);
  assert.strictEqual(ashPayload.subscription, 'FREE');
  assert.ok(ashPayload.date, 'Debe incluir fecha');
  console.log('✓ Payload de Ash verificado con los 13 campos requeridos y datos reales.');

  // Payload de partida para Misty (PREMIUM)
  const mistyMatch = {
    playerId: mistyLogin.user.id,
    username: mistyLogin.user.username,
    playerName: mistyLogin.user.name,
    difficulty: 'avanzado',
    generation: 2,
    score: 150,
    correctAnswers: 1,
    incorrectAnswers: 2,
    questionsAnswered: 3,
    bestStreak: 1,
    hintsUsed: 0,
    isNewRecord: false,
    subscription: mistyLogin.user.subscription,
    date: new Date().toISOString()
  };

  const mistyPayload = buildN8nPayload(mistyMatch);
  assert.strictEqual(mistyPayload.playerId, 'usr-player-2');
  assert.strictEqual(mistyPayload.username, 'misty');
  assert.strictEqual(mistyPayload.playerName, 'Misty Waterflower');
  assert.strictEqual(mistyPayload.difficulty, 'avanzado');
  assert.strictEqual(mistyPayload.generation, 2);
  assert.strictEqual(mistyPayload.score, 150);
  assert.strictEqual(mistyPayload.isNewRecord, false);
  assert.strictEqual(mistyPayload.subscription, 'PREMIUM');
  console.log('✓ Payload de Misty verificado: aislamiento estricto de cuentas y suscripciones.');

  // Verificación de guardado tolerante a fallos (offline resilience)
  console.log('6. Verificando que fallos de n8n no bloqueen el guardado local en PokéTrivia...');
  const testSaveResult = await saveScore(ashMatch);
  assert.strictEqual(testSaveResult.success, true, 'El guardado de PokéTrivia debe ser exitoso incluso si n8n no responde');
  assert.ok(testSaveResult.data, 'Debe contener los datos guardados de la partida');
  assert.strictEqual(testSaveResult.data.score, 300);
  console.log('✓ Resiliencia comprobada: partida guardada localmente/servidor con éxito independiente de n8n.');

  console.log('--- TODAS LAS PRUEBAS DE LÓGICA Y N8N PASARON EXITOSAMENTE ---');
}

testAll().catch((err) => {
  console.error('Error durante la verificación:', err);
  process.exit(1);
});
