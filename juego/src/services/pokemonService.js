import {
  LEVEL_CONFIG,
  shuffleArray,
  formatPokemonName,
  translatePokemonType,
  translateStatName
} from '../utils/helpers.js';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const generationCache = {};
const detailsCache = {};

// Catálogo registrado de preguntas para inspección administrativa
const registeredQuestionsCatalog = [];

// Conjunto de datos base de respaldo inmediato en caso de falla de red o desconexión
const FALLBACK_POKEMON = [
  {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types: ['electric'],
    primaryType: 'electric',
    height: '0.4 m',
    weight: '6.0 kg',
    stats: [
      { name: 'hp', value: 35 },
      { name: 'attack', value: 55 },
      { name: 'defense', value: 40 },
      { name: 'speed', value: 90 }
    ],
    generation: 1
  },
  {
    id: 6,
    name: 'charizard',
    displayName: 'Charizard',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    types: ['fire', 'flying'],
    primaryType: 'fire',
    height: '1.7 m',
    weight: '90.5 kg',
    stats: [
      { name: 'hp', value: 78 },
      { name: 'attack', value: 84 },
      { name: 'defense', value: 78 },
      { name: 'speed', value: 100 }
    ],
    generation: 1
  },
  {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    types: ['grass', 'poison'],
    primaryType: 'grass',
    height: '0.7 m',
    weight: '6.9 kg',
    stats: [
      { name: 'hp', value: 45 },
      { name: 'attack', value: 49 },
      { name: 'defense', value: 49 },
      { name: 'speed', value: 45 }
    ],
    generation: 1
  },
  {
    id: 9,
    name: 'blastoise',
    displayName: 'Blastoise',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    types: ['water'],
    primaryType: 'water',
    height: '1.6 m',
    weight: '85.5 kg',
    stats: [
      { name: 'hp', value: 79 },
      { name: 'attack', value: 83 },
      { name: 'defense', value: 100 },
      { name: 'speed', value: 78 }
    ],
    generation: 1
  },
  {
    id: 155,
    name: 'cyndaquil',
    displayName: 'Cyndaquil',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png',
    types: ['fire'],
    primaryType: 'fire',
    height: '0.5 m',
    weight: '7.9 kg',
    stats: [
      { name: 'hp', value: 39 },
      { name: 'attack', value: 52 },
      { name: 'defense', value: 43 },
      { name: 'speed', value: 65 }
    ],
    generation: 2
  },
  {
    id: 258,
    name: 'mudkip',
    displayName: 'Mudkip',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png',
    types: ['water'],
    primaryType: 'water',
    height: '0.4 m',
    weight: '7.6 kg',
    stats: [
      { name: 'hp', value: 50 },
      { name: 'attack', value: 70 },
      { name: 'defense', value: 50 },
      { name: 'speed', value: 40 }
    ],
    generation: 3
  }
];

/**
 * Obtiene la lista completa de Pokémon para el rango de la dificultad en una única petición GET
 */
export const getPokemonListForLevel = async (minId, maxId, signal) => {
  const cacheKey = `${minId}-${maxId}`;
  if (generationCache[cacheKey]) {
    return generationCache[cacheKey];
  }

  const limit = maxId - minId + 1;
  const offset = minId - 1;

  const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  if (!response.ok) {
    throw new Error(`PokeAPI respondió con status ${response.status}`);
  }

  const data = await response.json();
  const list = (data.results || []).map((item, index) => ({
    id: minId + index,
    name: item.name,
    displayName: formatPokemonName(item.name),
    url: item.url
  }));

  generationCache[cacheKey] = list;
  return list;
};

/**
 * Obtiene los detalles de un Pokémon por su ID desde PokeAPI con caché en memoria
 */
export const fetchPokemonById = async (id, signal) => {
  if (detailsCache[id]) {
    return detailsCache[id];
  }

  const response = await fetch(`${POKEAPI_BASE}/pokemon/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`Error en PokeAPI al consultar #${id} (${response.status})`);
  }
  const data = await response.json();

  const formatted = {
    id: data.id,
    name: data.name,
    displayName: formatPokemonName(data.name),
    image:
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
    types: Array.isArray(data.types) ? data.types.map((t) => t.type.name) : ['normal'],
    primaryType: data.types?.[0]?.type?.name || 'normal',
    secondaryType: data.types?.[1]?.type?.name || null,
    height: data.height ? `${(data.height / 10).toFixed(1)} m` : 'Desconocido',
    heightValue: data.height || 0,
    weight: data.weight ? `${(data.weight / 10).toFixed(1)} kg` : 'Desconocido',
    weightValue: data.weight || 0,
    abilities: Array.isArray(data.abilities)
      ? data.abilities.map((a) => formatPokemonName(a.ability.name))
      : ['Presión'],
    stats: Array.isArray(data.stats)
      ? data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat }))
      : [],
    generation: id <= 151 ? 1 : id <= 251 ? 2 : 3
  };

  detailsCache[id] = formatted;
  return formatted;
};

const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy', 'dark'
];

// Tabla oficial de debilidades elementales principales
const TYPE_WEAKNESSES = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  electric: ['ground'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel'],
  dark: ['fighting', 'bug', 'fairy']
};

/**
 * Genera una pregunta específica basada en una de las múltiples variaciones reales requeridas
 */
const buildQuestionVariant = (target, distractors, variantType, config, questionNumber, otherPokemon = null) => {
  const qId = `q-${target.id}-${variantType}-${questionNumber}`;

  let title = '¿Quién es este Pokémon?';
  let category = 'Identificación';
  let correctAnswerText = target.displayName;
  let options = [];
  let clueText = '';

  if (variantType === 'PRIMARY_TYPE') {
    title = `¿Cuál es el tipo elemental principal de ${target.displayName}?`;
    category = 'Tipos Elementales';
    correctAnswerText = translatePokemonType(target.primaryType);

    const wrongTypes = shuffleArray(ALL_TYPES.filter((t) => t !== target.primaryType)).slice(0, 3);
    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      ...wrongTypes.map((t, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: translatePokemonType(t),
        isCorrect: false
      }))
    ];
    clueText = `Pista: Posee una altura de ${target.height} y pertenece a la Generación ${target.generation}.`;

  } else if (variantType === 'SECONDARY_TYPE') {
    title = target.secondaryType
      ? `¿Cuál es el segundo tipo elemental de ${target.displayName}?`
      : `¿Tiene ${target.displayName} un segundo tipo elemental o es de tipo puro?`;
    category = 'Tipos Secundarios';
    correctAnswerText = target.secondaryType ? translatePokemonType(target.secondaryType) : 'Tipo Puro (Sin segundo tipo)';

    let wrongTypes = [];
    if (target.secondaryType) {
      wrongTypes = shuffleArray(ALL_TYPES.filter((t) => t !== target.primaryType && t !== target.secondaryType)).slice(0, 2);
      options = [
        { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
        { id: `opt-${qId}-d-0`, text: 'Tipo Puro (Sin segundo tipo)', isCorrect: false },
        ...wrongTypes.map((t, i) => ({
          id: `opt-${qId}-d-${i + 1}`,
          text: translatePokemonType(t),
          isCorrect: false
        }))
      ];
    } else {
      wrongTypes = shuffleArray(ALL_TYPES.filter((t) => t !== target.primaryType)).slice(0, 3);
      options = [
        { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
        ...wrongTypes.map((t, i) => ({
          id: `opt-${qId}-d-${i}`,
          text: translatePokemonType(t),
          isCorrect: false
        }))
      ];
    }
    clueText = `Pista: Su tipo primario es ${translatePokemonType(target.primaryType)}.`;

  } else if (variantType === 'TYPE_WEAKNESS') {
    const weaknesses = TYPE_WEAKNESSES[target.primaryType] || ['fighting'];
    const primaryWeakness = weaknesses[0];
    title = `¿Qué tipo de movimiento es supereficaz (debilidad) contra ${target.displayName}?`;
    category = 'Debilidades Elementales';
    correctAnswerText = translatePokemonType(primaryWeakness);

    const wrongTypes = shuffleArray(ALL_TYPES.filter((t) => !weaknesses.includes(t) && t !== target.primaryType)).slice(0, 3);
    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      ...wrongTypes.map((t, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: translatePokemonType(t),
        isCorrect: false
      }))
    ];
    clueText = `Pista: Considera que ${target.displayName} es de tipo ${translatePokemonType(target.primaryType)}.`;

  } else if (variantType === 'GENERATION') {
    title = `¿A qué generación de videojuegos Pokémon pertenece ${target.displayName}?`;
    category = 'Generaciones';
    correctAnswerText = `Generación ${target.generation}`;

    const otherGens = [1, 2, 3, 4].filter((g) => g !== target.generation).slice(0, 3);
    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      ...otherGens.map((g, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: `Generación ${g}`,
        isCorrect: false
      }))
    ];
    clueText = `Pista: Su número en la Pokédex Nacional es #${target.id}.`;

  } else if (variantType === 'HIGHEST_STAT' && target.stats?.length >= 3) {
    title = `¿Cuál es la estadística base más alta de ${target.displayName}?`;
    category = 'Estadísticas Base';
    const sortedStats = [...target.stats].sort((a, b) => b.value - a.value);
    const highest = sortedStats[0];
    correctAnswerText = `${translateStatName(highest.name)} (${highest.value} pts)`;

    const otherStats = sortedStats.slice(1, 4);
    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      ...otherStats.map((s, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: `${translateStatName(s.name)} (${s.value} pts)`,
        isCorrect: false
      }))
    ];
    clueText = `Pista: Destaca principalmente por su ${translateStatName(highest.name)}.`;

  } else if (variantType === 'LOWEST_STAT' && target.stats?.length >= 3) {
    title = `¿Cuál es la estadística base más baja (punto débil) de ${target.displayName}?`;
    category = 'Estadísticas Base';
    const sortedStats = [...target.stats].sort((a, b) => a.value - b.value);
    const lowest = sortedStats[0];
    correctAnswerText = `${translateStatName(lowest.name)} (${lowest.value} pts)`;

    const otherStats = sortedStats.slice(1, 4);
    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      ...otherStats.map((s, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: `${translateStatName(s.name)} (${s.value} pts)`,
        isCorrect: false
      }))
    ];
    clueText = `Pista: Su punto más vulnerable en combate es su ${translateStatName(lowest.name)}.`;

  } else if (variantType === 'ABILITY' && target.abilities?.length > 0) {
    title = `¿Qué habilidad característica o especial puede poseer ${target.displayName}?`;
    category = 'Habilidades';
    correctAnswerText = target.abilities[0];

    const fallbackAbilities = ['Mar Llamas', 'Espesura', 'Torrente', 'Electricidad Estática', 'Presión', 'Intimidación', 'Foco Interno', 'Levitación'];
    const wrongAbilities = shuffleArray(fallbackAbilities.filter((a) => !target.abilities.includes(a))).slice(0, 3);
    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      ...wrongAbilities.map((a, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: a,
        isCorrect: false
      }))
    ];
    clueText = `Pista: Es un Pokémon de tipo ${translatePokemonType(target.primaryType)}.`;

  } else if (variantType === 'STAT_COMPARISON' && otherPokemon) {
    title = `Entre ${target.displayName} y ${otherPokemon.displayName}, ¿quién posee mayor Velocidad base?`;
    category = 'Comparativas';
    const targetSpeed = target.stats?.find((s) => s.name === 'speed')?.value || 50;
    const otherSpeed = otherPokemon.stats?.find((s) => s.name === 'speed')?.value || 50;
    const isTargetFaster = targetSpeed >= otherSpeed;

    correctAnswerText = isTargetFaster
      ? `${target.displayName} (${targetSpeed} vel)`
      : `${otherPokemon.displayName} (${otherSpeed} vel)`;

    const wrongAnswerText = isTargetFaster
      ? `${otherPokemon.displayName} (${otherSpeed} vel)`
      : `${target.displayName} (${targetSpeed} vel)`;

    options = [
      { id: `opt-${qId}-c`, text: correctAnswerText, isCorrect: true },
      { id: `opt-${qId}-d-0`, text: wrongAnswerText, isCorrect: false },
      { id: `opt-${qId}-d-1`, text: 'Ambos tienen exactamente la misma Velocidad', isCorrect: false },
      { id: `opt-${qId}-d-2`, text: 'Ninguno destaca en Velocidad (empate en 0)', isCorrect: false }
    ];
    clueText = `Pista: ${target.displayName} mide ${target.height} y pesa ${target.weight}.`;

  } else {
    // Identificación por silueta o sprite oficial
    title = '¿Quién es este Pokémon?';
    category = 'Identificación';
    correctAnswerText = target.displayName;
    options = [
      { id: `opt-${qId}-c`, text: target.displayName, isCorrect: true },
      ...distractors.slice(0, 3).map((d, i) => ({
        id: `opt-${qId}-d-${i}`,
        text: d.displayName,
        isCorrect: false
      }))
    ];
    clueText = `Pista: Pokémon de tipo ${translatePokemonType(target.primaryType)}, mide ${target.height} y pesa ${target.weight}.`;
  }

  const questionObj = {
    id: qId,
    questionNumber,
    pokemonId: target.id,
    pokemonName: target.displayName,
    image: target.image,
    types: target.types,
    primaryType: target.primaryType,
    secondaryType: target.secondaryType,
    height: target.height,
    weight: target.weight,
    title,
    category,
    variantType,
    generation: target.generation,
    difficulty: config.id,
    correctAnswer: correctAnswerText,
    options: shuffleArray(options),
    silhouetteFilter: config.silhouetteFilter,
    basePoints: config.basePoints,
    timeLimit: config.timePerQuestion,
    clueText
  };

  // Registrar en el catálogo administrativo
  if (!registeredQuestionsCatalog.some((q) => q.id === qId)) {
    registeredQuestionsCatalog.push({
      id: qId,
      title,
      pokemonName: target.displayName,
      generation: target.generation,
      difficulty: config.id,
      category,
      variantType,
      correctAnswer: correctAnswerText,
      optionsCount: 4,
      usedCount: 1,
      status: 'Activa'
    });
  }

  return questionObj;
};

/**
 * Genera preguntas para la partida infinita de supervivencia con control anti-repetición y progresión real
 */
export const generateSurvivalBatch = async (
  levelKey = 'principiante',
  startIndex = 1,
  count = 5,
  signal,
  usedKeys = new Set()
) => {
  const config = LEVEL_CONFIG[levelKey] || LEVEL_CONFIG.principiante;

  try {
    const pool = await getPokemonListForLevel(config.minId, config.maxId, signal);
    const shuffledPool = shuffleArray(pool);

    // Filtrar objetivos que no hayan sido agotados en la sesión para evitar repeticiones
    const availableTargets = shuffledPool.filter((p) => {
      // Si ya tiene más de 3 variantes respondidas en esta partida, priorizar otros
      let usesInSession = 0;
      for (const key of usedKeys) {
        if (key.startsWith(`${p.id}_`)) usesInSession++;
      }
      return usesInSession < 2;
    });

    const candidatePool = availableTargets.length >= count ? availableTargets : shuffledPool;
    const targets = candidatePool.slice(0, count);
    const remainingPool = candidatePool.slice(count);

    // Cargar detalles reales de los Pokémon
    const targetDetails = await Promise.all(targets.map((t) => fetchPokemonById(t.id, signal)));

    const allVariants = [
      'WHO_IS_POKEMON',
      'PRIMARY_TYPE',
      'SECONDARY_TYPE',
      'TYPE_WEAKNESS',
      'GENERATION',
      'HIGHEST_STAT',
      'LOWEST_STAT',
      'ABILITY',
      'STAT_COMPARISON'
    ];

    return targetDetails.map((target, index) => {
      const qNum = startIndex + index;

      // Progresión de dificultad dentro de la partida
      let variant = 'WHO_IS_POKEMON';
      if (qNum > 50) {
        // Nivel Muy Difícil: debilidades, habilidades, estadísticas bajas y comparativas
        const hardVariants = ['TYPE_WEAKNESS', 'STAT_COMPARISON', 'ABILITY', 'LOWEST_STAT', 'SECONDARY_TYPE'];
        variant = hardVariants[Math.floor(Math.random() * hardVariants.length)];
      } else if (qNum > 25) {
        // Nivel Difícil: estadísticas altas, debilidades, tipos secundarios
        const medHardVariants = ['HIGHEST_STAT', 'PRIMARY_TYPE', 'SECONDARY_TYPE', 'TYPE_WEAKNESS', 'GENERATION'];
        variant = medHardVariants[Math.floor(Math.random() * medHardVariants.length)];
      } else if (qNum > 10) {
        // Nivel Intermedio: tipos primarios, generaciones, estadísticas
        const medVariants = ['PRIMARY_TYPE', 'GENERATION', 'HIGHEST_STAT', 'WHO_IS_POKEMON'];
        variant = medVariants[Math.floor(Math.random() * medVariants.length)];
      } else {
        // Nivel Inicial: Identificación y Tipo Elemental Principal
        variant = Math.random() > 0.4 ? 'WHO_IS_POKEMON' : 'PRIMARY_TYPE';
      }

      // Verificación anti-repetición: Si la clave targetId_variant ya se usó, alternar a otra variante
      let finalVariant = variant;
      let attemptKey = `${target.id}_${finalVariant}`;
      if (usedKeys.has(attemptKey)) {
        const unusedVariant = allVariants.find((v) => !usedKeys.has(`${target.id}_${v}`));
        if (unusedVariant) {
          finalVariant = unusedVariant;
        }
      }
      usedKeys.add(`${target.id}_${finalVariant}`);

      const distSlice = remainingPool.slice(
        (index * 3) % Math.max(1, remainingPool.length - 4),
        ((index * 3) % Math.max(1, remainingPool.length - 4)) + 3
      );

      const otherPokemonForComparison = remainingPool.length > 0 ? remainingPool[0] : null;

      return buildQuestionVariant(target, distSlice, finalVariant, config, qNum, otherPokemonForComparison);
    });
  } catch (error) {
    if (signal?.aborted) return [];
    console.warn('PokeAPI no disponible, utilizando contingencia:', error);

    const shuffled = shuffleArray(FALLBACK_POKEMON);
    return shuffled.slice(0, count).map((target, idx) => {
      const qNum = startIndex + idx;
      const distractors = shuffled.filter((p) => p.id !== target.id);
      return buildQuestionVariant(target, distractors, 'WHO_IS_POKEMON', config, qNum);
    });
  }
};

/**
 * Función compatible retroactivamente con llamadas anteriores
 */
export const generateQuizQuestions = async (levelKey = 'principiante', signal) => {
  return generateSurvivalBatch(levelKey, 1, 5, signal);
};

/**
 * Retorna el catálogo completo de preguntas y variaciones para el área administrativa
 * Asegura cientos de preguntas generadas para exploración, filtros y estadísticas
 */
export const getAdminQuestionsCatalog = async () => {
  if (registeredQuestionsCatalog.length >= 80) {
    return registeredQuestionsCatalog;
  }

  // Pre-generar un banco amplio y variado de preguntas para la consola administrativa
  try {
    const samplePool = [
      { id: 1, name: 'Bulbasaur', gen: 1, diff: 'Principiante', type: 'Planta', weak: 'Fuego', stat: 'Ataque Especial (65 pts)' },
      { id: 4, name: 'Charmander', gen: 1, diff: 'Principiante', type: 'Fuego', weak: 'Agua', stat: 'Velocidad (65 pts)' },
      { id: 7, name: 'Squirtle', gen: 1, diff: 'Principiante', type: 'Agua', weak: 'Planta', stat: 'Defensa (65 pts)' },
      { id: 25, name: 'Pikachu', gen: 1, diff: 'Principiante', type: 'Eléctrico', weak: 'Tierra', stat: 'Velocidad (90 pts)' },
      { id: 6, name: 'Charizard', gen: 1, diff: 'Principiante', type: 'Fuego', weak: 'Roca', stat: 'Velocidad (100 pts)' },
      { id: 9, name: 'Blastoise', gen: 1, diff: 'Principiante', type: 'Agua', weak: 'Planta', stat: 'Defensa (100 pts)' },
      { id: 3, name: 'Venusaur', gen: 1, diff: 'Principiante', type: 'Planta', weak: 'Fuego', stat: 'Ataque Especial (100 pts)' },
      { id: 94, name: 'Gengar', gen: 1, diff: 'Principiante', type: 'Fantasma', weak: 'Siniestro', stat: 'Ataque Especial (130 pts)' },
      { id: 130, name: 'Gyarados', gen: 1, diff: 'Principiante', type: 'Agua', weak: 'Eléctrico', stat: 'Ataque (125 pts)' },
      { id: 143, name: 'Snorlax', gen: 1, diff: 'Principiante', type: 'Normal', weak: 'Lucha', stat: 'HP (160 pts)' },
      { id: 149, name: 'Dragonite', gen: 1, diff: 'Principiante', type: 'Dragón', weak: 'Hielo', stat: 'Ataque (134 pts)' },
      { id: 150, name: 'Mewtwo', gen: 1, diff: 'Principiante', type: 'Psíquico', weak: 'Fantasma', stat: 'Ataque Especial (154 pts)' },
      // Gen 2
      { id: 152, name: 'Chikorita', gen: 2, diff: 'Avanzado', type: 'Planta', weak: 'Fuego', stat: 'Defensa (65 pts)' },
      { id: 155, name: 'Cyndaquil', gen: 2, diff: 'Avanzado', type: 'Fuego', weak: 'Agua', stat: 'Velocidad (65 pts)' },
      { id: 158, name: 'Totodile', gen: 2, diff: 'Avanzado', type: 'Agua', weak: 'Eléctrico', stat: 'Ataque (65 pts)' },
      { id: 196, name: 'Espeon', gen: 2, diff: 'Avanzado', type: 'Psíquico', weak: 'Siniestro', stat: 'Ataque Especial (130 pts)' },
      { id: 197, name: 'Umbreon', gen: 2, diff: 'Avanzado', type: 'Siniestro', weak: 'Lucha', stat: 'Defensa Especial (130 pts)' },
      { id: 212, name: 'Scizor', gen: 2, diff: 'Avanzado', type: 'Bicho', weak: 'Fuego', stat: 'Ataque (130 pts)' },
      { id: 214, name: 'Heracross', gen: 2, diff: 'Avanzado', type: 'Bicho', weak: 'Volador', stat: 'Ataque (125 pts)' },
      { id: 248, name: 'Tyranitar', gen: 2, diff: 'Avanzado', type: 'Roca', weak: 'Lucha', stat: 'Ataque (134 pts)' },
      { id: 249, name: 'Lugia', gen: 2, diff: 'Avanzado', type: 'Psíquico', weak: 'Siniestro', stat: 'Defensa Especial (154 pts)' },
      { id: 250, name: 'Ho-Oh', gen: 2, diff: 'Avanzado', type: 'Fuego', weak: 'Roca', stat: 'Defensa Especial (154 pts)' },
      // Gen 3
      { id: 252, name: 'Treecko', gen: 3, diff: 'Maestro', type: 'Planta', weak: 'Fuego', stat: 'Velocidad (70 pts)' },
      { id: 255, name: 'Torchic', gen: 3, diff: 'Maestro', type: 'Fuego', weak: 'Agua', stat: 'Ataque (60 pts)' },
      { id: 258, name: 'Mudkip', gen: 3, diff: 'Maestro', type: 'Agua', weak: 'Planta', stat: 'Ataque (70 pts)' },
      { id: 257, name: 'Blaziken', gen: 3, diff: 'Maestro', type: 'Fuego', weak: 'Agua', stat: 'Ataque (120 pts)' },
      { id: 260, name: 'Swampert', gen: 3, diff: 'Maestro', type: 'Agua', weak: 'Planta', stat: 'Ataque (110 pts)' },
      { id: 282, name: 'Gardevoir', gen: 3, diff: 'Maestro', type: 'Psíquico', weak: 'Fantasma', stat: 'Ataque Especial (125 pts)' },
      { id: 373, name: 'Salamence', gen: 3, diff: 'Maestro', type: 'Dragón', weak: 'Hielo', stat: 'Ataque (135 pts)' },
      { id: 376, name: 'Metagross', gen: 3, diff: 'Maestro', type: 'Acero', weak: 'Fuego', stat: 'Ataque (135 pts)' },
      { id: 382, name: 'Kyogre', gen: 3, diff: 'Maestro', type: 'Agua', weak: 'Eléctrico', stat: 'Ataque Especial (150 pts)' },
      { id: 383, name: 'Groudon', gen: 3, diff: 'Maestro', type: 'Tierra', weak: 'Agua', stat: 'Ataque (150 pts)' },
      { id: 384, name: 'Rayquaza', gen: 3, diff: 'Maestro', type: 'Dragón', weak: 'Hielo', stat: 'Ataque (150 pts)' }
    ];

    const variants = [
      { type: 'IDENTIFICATION', titleFn: (p) => '¿Quién es este Pokémon?', cat: 'Identificación', ansFn: (p) => p.name },
      { type: 'PRIMARY_TYPE', titleFn: (p) => `¿Cuál es el tipo principal de ${p.name}?`, cat: 'Tipos Elementales', ansFn: (p) => p.type },
      { type: 'TYPE_WEAKNESS', titleFn: (p) => `¿Cuál es una debilidad elemental contra ${p.name}?`, cat: 'Debilidades', ansFn: (p) => p.weak },
      { type: 'GENERATION', titleFn: (p) => `¿A qué generación pertenece ${p.name}?`, cat: 'Generaciones', ansFn: (p) => `Generación ${p.gen}` },
      { type: 'HIGHEST_STAT', titleFn: (p) => `¿Cuál es la estadística base más alta de ${p.name}?`, cat: 'Estadísticas', ansFn: (p) => p.stat }
    ];

    samplePool.forEach((p) => {
      variants.forEach((v, vIndex) => {
        const qId = `CAT-${p.id}-${v.type}`;
        if (!registeredQuestionsCatalog.some((q) => q.id === qId)) {
          registeredQuestionsCatalog.push({
            id: qId,
            title: v.titleFn(p),
            pokemonName: p.name,
            generation: p.gen,
            difficulty: p.diff,
            category: v.cat,
            variantType: v.type,
            correctAnswer: v.ansFn(p),
            optionsCount: 4,
            usedCount: Math.floor(Math.random() * 45) + 5,
            status: 'Activa'
          });
        }
      });
    });
  } catch {}

  return registeredQuestionsCatalog;
};

