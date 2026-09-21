import React from 'react';
import { Heart } from 'lucide-react';

export const LivesDisplay = ({ lives = 5, maxLives = 5 }) => {
  // Construir array con identificadores únicos estables para renderizado
  const hearts = Array.from({ length: maxLives }, (_, i) => ({
    id: `heart-slot-${i + 1}`,
    isActive: i < lives
  }));

  return (
    <div className="lives-display" aria-label={`Vidas restantes: ${lives} de ${maxLives}`}>
      <span className="lives-label">Vidas:</span>
      <div className="hearts-container">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className={`heart-wrapper ${heart.isActive ? 'active' : 'depleted'}`}
          >
            <Heart
              size={20}
              className={`heart-icon ${heart.isActive ? 'fill-active' : 'fill-depleted'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
