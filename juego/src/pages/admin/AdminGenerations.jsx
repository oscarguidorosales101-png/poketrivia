import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

const GENERATIONS_DATA = [
  {
    gen: 1,
    region: 'Kanto',
    difficulty: 'Principiante',
    range: 'IDs 1 a 151 (151 Pokémon)',
    starters: ['Bulbasaur', 'Charmander', 'Squirtle'],
    iconics: ['Pikachu', 'Mewtwo', 'Charizard', 'Gengar'],
    badgeColor: 'border-blue'
  },
  {
    gen: 2,
    region: 'Johto',
    difficulty: 'Avanzado',
    range: 'IDs 152 a 251 (100 Pokémon)',
    starters: ['Chikorita', 'Cyndaquil', 'Totodile'],
    iconics: ['Lugia', 'Ho-Oh', 'Tyranitar', 'Scizor'],
    badgeColor: 'border-gold'
  },
  {
    gen: 3,
    region: 'Hoenn',
    difficulty: 'Maestro',
    range: 'IDs 252 a 386 (135 Pokémon)',
    starters: ['Treecko', 'Torchic', 'Mudkip'],
    iconics: ['Rayquaza', 'Blaziken', 'Salamence', 'Kyogre'],
    badgeColor: 'border-red'
  }
];

export const AdminGenerations = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Generaciones Habilitadas</h1>
          <p className="admin-page-sub">
            Distribución del catálogo de videojuegos por regiones y rangos oficiales de PokeAPI.
          </p>
        </div>
      </div>

      <div className="generations-cards-grid">
        {GENERATIONS_DATA.map((g) => (
          <div key={g.gen} className={`gen-detail-card ${g.badgeColor}`}>
            <div className="gen-card-header">
              <span className="gen-num-badge">Generación {g.gen}</span>
              <span className="gen-region-name">{g.region}</span>
            </div>

            <div className="gen-meta-block">
              <span className="gen-meta-lbl">Dificultad Asociada:</span>
              <strong className="gen-meta-val">{g.difficulty}</strong>
            </div>

            <div className="gen-meta-block">
              <span className="gen-meta-lbl">Rango de IDs PokeAPI:</span>
              <span className="gen-meta-val font-mono">{g.range}</span>
            </div>

            <div className="gen-starters-block">
              <span className="gen-meta-lbl">Iniciales Icónicos:</span>
              <div className="tag-chips-row">
                {g.starters.map((s) => (
                  <span key={s} className="tag-chip">{s}</span>
                ))}
              </div>
            </div>

            <div className="gen-starters-block">
              <span className="gen-meta-lbl">Especies Destacadas:</span>
              <div className="tag-chips-row">
                {g.iconics.map((s) => (
                  <span key={s} className="tag-chip gold">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
