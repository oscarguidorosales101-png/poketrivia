const AUTH_STORAGE_KEY = 'poketrivia_auth_session';
const API_USERS_URL = 'http://localhost:3001/users';

// Usuarios de respaldo garantizados (coincidentes con db.json)
const DEFAULT_USERS = [
  {
    id: 'usr-player',
    username: 'ash',
    password: 'pikachu123',
    name: 'Ash Ketchum',
    role: 'PLAYER',
    avatar: null,
    hints: 5,
    totalScore: 1200,
    matchesPlayed: 6,
    matchesFinished: 6,
    questionsAnswered: 28,
    correctAnswers: 22,
    incorrectAnswers: 6,
    bestStreak: 7,
    hintsUsed: 4,
    favoriteDifficulty: 'principiante',
    createdAt: '2026-09-01T12:00:00.000Z',
    subscription: {
      type: 'FREE',
      status: 'active',
      plan: 'Plan Gratuito',
      hintsBonus: 0
    }
  },
  {
    id: 'usr-admin',
    username: 'oak',
    password: 'profesor123',
    name: 'Profesor Oak',
    role: 'ADMIN',
    avatar: null,
    hints: 99,
    totalScore: 4800,
    matchesPlayed: 18,
    matchesFinished: 18,
    questionsAnswered: 95,
    correctAnswers: 88,
    incorrectAnswers: 7,
    bestStreak: 19,
    hintsUsed: 12,
    favoriteDifficulty: 'maestro',
    createdAt: '2026-08-15T09:30:00.000Z',
    subscription: {
      type: 'PREMIUM',
      status: 'active',
      plan: 'Pase Maestro (2 Meses)',
      durationMonths: 2,
      hintsBonus: 50,
      expiresAt: '2026-11-21T00:00:00.000Z'
    }
  },
  {
    id: 'usr-player-2',
    username: 'misty',
    password: 'starmie123',
    name: 'Misty Waterflower',
    role: 'PLAYER',
    avatar: null,
    hints: 15,
    totalScore: 2150,
    matchesPlayed: 9,
    matchesFinished: 9,
    questionsAnswered: 44,
    correctAnswers: 36,
    incorrectAnswers: 8,
    bestStreak: 9,
    hintsUsed: 6,
    favoriteDifficulty: 'avanzado',
    createdAt: '2026-09-05T15:20:00.000Z',
    subscription: {
      type: 'PREMIUM',
      status: 'active',
      plan: 'Pase Mensual',
      durationMonths: 1,
      hintsBonus: 20,
      expiresAt: '2026-10-21T00:00:00.000Z'
    }
  }
];

/**
 * Autentica un usuario verificando credenciales reales contra el servidor o datos locales
 */
export const login = async (username, password) => {
  const cleanUsername = username?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  let users = DEFAULT_USERS;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(API_USERS_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        users = data;
      }
    }
  } catch {
    // Si json-server no responde, utiliza la lista de usuarios por defecto
  }

  const foundUser = users.find(
    (u) => u.username.toLowerCase() === cleanUsername && u.password === cleanPassword
  );

  if (!foundUser) {
    return {
      success: false,
      error: 'Credenciales inválidas. Por favor verifica usuario y contraseña.'
    };
  }

  // Ocultar contraseña antes de almacenar en sesión
  const { password: _, ...safeUser } = foundUser;

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
  }

  return {
    success: true,
    user: safeUser
  };
};

/**
 * Cierra la sesión activa conservando todos los datos en db.json y localmente
 */
export const logout = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

/**
 * Obtiene el usuario autenticado actualmente en la sesión
 */
export const getCurrentUser = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Actualiza la información del perfil del usuario (avatar, nombre, etc.)
 */
export const updateUserProfile = async (userId, updates) => {
  const currentUser = getCurrentUser();
  let updatedUser = { ...currentUser, ...updates };

  if (currentUser && currentUser.id === userId) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  }

  try {
    await fetch(`${API_USERS_URL}/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  } catch {}

  return updatedUser;
};

/**
 * Acumula las estadísticas de una partida finalizada al perfil del jugador
 */
export const recordUserMatchStats = async (userId, matchStats) => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id !== userId) return null;

  const currentTotal = Number(currentUser.totalScore) || 0;
  const currentMatches = Number(currentUser.matchesPlayed) || 0;
  const currentQA = Number(currentUser.questionsAnswered) || 0;
  const currentCA = Number(currentUser.correctAnswers) || 0;
  const currentIA = Number(currentUser.incorrectAnswers) || 0;
  const currentStreak = Number(currentUser.bestStreak) || 0;
  const currentHints = Number(currentUser.hintsUsed) || 0;

  const updates = {
    totalScore: currentTotal + (Number(matchStats.score) || 0),
    matchesPlayed: currentMatches + 1,
    matchesFinished: currentMatches + 1,
    questionsAnswered: currentQA + (Number(matchStats.questionsAnswered) || 0),
    correctAnswers: currentCA + (Number(matchStats.correctAnswers) || 0),
    incorrectAnswers: currentIA + (Number(matchStats.incorrectAnswers) || 0),
    bestStreak: Math.max(currentStreak, Number(matchStats.bestStreak) || 0),
    hintsUsed: currentHints + (Number(matchStats.hintsUsed) || 0),
    favoriteDifficulty: matchStats.difficulty || currentUser.favoriteDifficulty || 'principiante'
  };

  return updateUserProfile(userId, updates);
};

/**
 * Actualiza la cantidad de pistas del usuario en sesión y en db.json
 */
export const updateUserHints = async (userId, newHintsCount) => {
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.hints = Math.max(0, newHintsCount);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    }
  }

  try {
    await fetch(`${API_USERS_URL}/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hints: Math.max(0, newHintsCount) })
    });
  } catch {
    // Ignorar si el servidor no está disponible
  }
};
