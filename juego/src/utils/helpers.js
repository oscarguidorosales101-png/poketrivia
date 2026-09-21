/**
 * Configuraciones por nivel de dificultad del juego de supervivencia
 */
export const LEVEL_CONFIG = {
  principiante: {
    id: 'principiante',
    alias: 'facil',
    name: 'Principiante (Generación 1 - Kanto)',
    badge: 'Principiante',
    generation: 1,
    description: 'Generación 1 (Kanto). 5 vidas, 100 puntos base por respuesta correcta.',
    lives: 5,
    basePoints: 100,
    timePerQuestion: 15,
    minId: 1,
    maxId: 151,
    recordKey: 'beginner',
    silhouetteFilter: 'brightness(0) drop-shadow(0 0 10px rgba(56, 189, 248, 0.4))'
  },
  avanzado: {
    id: 'avanzado',
    alias: 'medio',
    name: 'Avanzado (Generación 2 - Johto)',
    badge: 'Avanzado',
    generation: 2,
    description: 'Generación 2 (Johto). 4 vidas, 200 puntos base por respuesta correcta.',
    lives: 4,
    basePoints: 200,
    timePerQuestion: 12,
    minId: 152,
    maxId: 251,
    recordKey: 'advanced',
    silhouetteFilter: 'brightness(0) drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))'
  },
  maestro: {
    id: 'maestro',
    alias: 'dificil',
    name: 'Maestro (Generación 3 - Hoenn)',
    badge: 'Maestro',
    generation: 3,
    description: 'Generación 3 (Hoenn). 3 vidas, 350 puntos base por respuesta correcta.',
    lives: 3,
    basePoints: 350,
    timePerQuestion: 10,
    minId: 252,
    maxId: 386,
    recordKey: 'master',
    silhouetteFilter: 'brightness(0) drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))'
  }
};

// Aliases para compatibilidad retroactiva con 'facil', 'medio', 'dificil'
LEVEL_CONFIG.facil = LEVEL_CONFIG.principiante;
LEVEL_CONFIG.medio = LEVEL_CONFIG.avanzado;
LEVEL_CONFIG.dificil = LEVEL_CONFIG.maestro;

/**
 * Obtiene el multiplicador por racha según la tabla estricta:
 * Racha 1-4: x1.0
 * Racha 5-9: x1.25
 * Racha 10-19: x1.5
 * Racha 20-29: x1.75
 * Racha 30+: x2.0
 */
export const getStreakMultiplier = (streak) => {
  if (streak >= 30) return 2.0;
  if (streak >= 20) return 1.75;
  if (streak >= 10) return 1.5;
  if (streak >= 5) return 1.25;
  return 1.0;
};

/**
 * Calcula los puntos ganados considerando pistas usadas y multiplicador de racha
 * Sin pistas: 100%
 * 1 pista: 75%
 * 2 pistas: 50%
 * El multiplicador se aplica DESPUÉS de la deducción por pistas y se redondea a entero.
 */
export const calculatePointsEarned = (basePoints, hintsUsedOnQuestion, currentStreak) => {
  let penaltyRate = 1.0;
  if (hintsUsedOnQuestion === 1) penaltyRate = 0.75;
  else if (hintsUsedOnQuestion >= 2) penaltyRate = 0.5;

  const pointsAfterHints = basePoints * penaltyRate;
  const multiplier = getStreakMultiplier(currentStreak);
  return Math.round(pointsAfterHints * multiplier);
};

/**
 * Determina la progresión de dificultad durante la partida infinita:
 * 1-10: Fácil (identificación directa)
 * 11-25: Intermedia (tipos elementales / silueta más oscura)
 * 26-50: Difícil (estadísticas y atributos)
 * 51+: Muy difícil (variantes avanzadas)
 */
export const getProgressiveDifficultyStage = (questionNumber) => {
  if (questionNumber <= 10) return { stage: 'Inicial', level: 'Fácil', color: '#22c55e' };
  if (questionNumber <= 25) return { stage: 'Intermedio', level: 'Medio', color: '#38bdf8' };
  if (questionNumber <= 50) return { stage: 'Avanzado', level: 'Difícil', color: '#f59e0b' };
  return { stage: 'Supervivencia Élite', level: 'Muy Difícil', color: '#ef4444' };
};

/**
 * Algoritmo Fisher-Yates para barajar arreglos inmutablemente
 */
export const shuffleArray = (array) => {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

/**
 * Formatea el nombre de un Pokémon (capitalización y limpieza)
 */
export const formatPokemonName = (name) => {
  if (!name) return 'Desconocido';
  const clean = name.replace(/-/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

/**
 * Traduce tipos de Pokémon al español
 */
export const translatePokemonType = (type) => {
  const map = {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    grass: 'Planta',
    electric: 'Eléctrico',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    steel: 'Acero',
    fairy: 'Hada',
    dark: 'Siniestro'
  };
  return map[type?.toLowerCase()] || type || 'Desconocido';
};

/**
 * Traduce nombres de estadísticas al español
 */
export const translateStatName = (stat) => {
  const map = {
    hp: 'Puntos de Salud (HP)',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad'
  };
  return map[stat?.toLowerCase()] || stat || 'Estadística';
};

/**
 * Retorna las clases de color para tipos de Pokémon
 */
export const getTypeBadgeClass = (type) => {
  const classes = {
    fire: 'badge-fire',
    water: 'badge-water',
    grass: 'badge-grass',
    electric: 'badge-electric',
    psychic: 'badge-psychic',
    ice: 'badge-ice',
    dragon: 'badge-dragon',
    ghost: 'badge-ghost',
    poison: 'badge-poison',
    ground: 'badge-ground',
    rock: 'badge-rock',
    fighting: 'badge-fighting',
    bug: 'badge-bug',
    steel: 'badge-steel',
    fairy: 'badge-fairy',
    normal: 'badge-normal'
  };
  return classes[type?.toLowerCase()] || 'badge-default';
};
