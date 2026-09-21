import React from 'react';
import { Tag, Sparkles, Layers, Sliders } from 'lucide-react';

const VARIATION_TEMPLATES = [
  {
    id: 'VAR-1',
    name: 'Variante 1: Identificación por Silueta',
    description: 'Presenta la silueta oscura y opciones de nombres.',
    exampleQuestion: '¿Quién es este Pokémon?',
    category: 'Identificación',
    difficulty: 'Principiante / Avanzado / Maestro',
    generation: '1, 2 y 3',
    timesUsed: 142,
    sampleOptions: ['Pikachu (Correcta)', 'Raichu', 'Pichu', 'Electabuzz']
  },
  {
    id: 'VAR-2',
    name: 'Variante 2: Tipo Elemental Principal',
    description: 'Evalúa el conocimiento de tipos elementales del Pokémon misterioso.',
    exampleQuestion: '¿Cuál es el tipo principal de Charizard?',
    category: 'Tipos Elementales',
    difficulty: 'Principiante y Avanzado',
    generation: '1 y 2',
    timesUsed: 89,
    sampleOptions: ['Fuego (Correcta)', 'Agua', 'Planta', 'Tierra']
  },
  {
    id: 'VAR-3',
    name: 'Variante 3: Asignación de Generación',
    description: 'Requiere indicar la generación de videojuegos a la que pertenece la especie.',
    exampleQuestion: '¿A qué generación pertenece Mudkip?',
    category: 'Generaciones',
    difficulty: 'Avanzado y Maestro',
    generation: '2 y 3',
    timesUsed: 65,
    sampleOptions: ['Generación 3 (Correcta)', 'Generación 1', 'Generación 2', 'Generación 4']
  },
  {
    id: 'VAR-4',
    name: 'Variante 4: Estadística Más Destacada',
    description: 'Compara valores base reales (Ataque, Defensa, Velocidad, HP).',
    exampleQuestion: '¿Cuál es la estadística base más destacada de Blastoise?',
    category: 'Estadísticas',
    difficulty: 'Maestro (Supervivencia Élite)',
    generation: '1 a 3',
    timesUsed: 47,
    sampleOptions: ['Defensa: 100 (Correcta)', 'Ataque: 83', 'Velocidad: 78', 'HP: 79']
  }
];

export const AdminVariations = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestión de Variaciones de Preguntas</h1>
          <p className="admin-page-sub">
            Matriz de variaciones dinámicas generadas para evitar cuestionarios estáticos o repetitivos.
          </p>
        </div>
      </div>

      <div className="variations-grid">
        {VARIATION_TEMPLATES.map((v) => (
          <div key={v.id} className="variation-card">
            <div className="var-header">
              <div className="var-tag">
                <Tag size={16} />
                <span>{v.category}</span>
              </div>
              <span className="var-used-badge">{v.timesUsed} partidas jugadas</span>
            </div>

            <h3 className="var-name">{v.name}</h3>
            <p className="var-desc">{v.description}</p>

            <div className="var-example-box">
              <span className="var-ex-label">Formulación de Ejemplo:</span>
              <p className="var-ex-q">"{v.exampleQuestion}"</p>
            </div>

            <div className="var-meta-row">
              <span><strong>Dificultades:</strong> {v.difficulty}</span>
              <span><strong>Generaciones:</strong> Gen {v.generation}</span>
            </div>

            <div className="var-options-preview">
              <span className="var-opt-title">Muestra de Opciones:</span>
              <ul>
                {v.sampleOptions.map((opt, i) => (
                  <li key={i} className={i === 0 ? 'correct-opt' : ''}>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
