import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Play,
  Heart,
  Timer,
  Award,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  Flame,
  ShieldAlert,
  Ban,
  Eye,
  FileText
} from 'lucide-react';
import { LEVEL_CONFIG } from '../utils/helpers';

export const Instructions = () => {
  return (
    <div className="page-container page-instructions">
      <div className="instructions-hero">
        <div className="hero-badge">
          <HelpCircle size={16} />
          <span>Manual de Supervivencia Pokémon</span>
        </div>
        <h1 className="hero-title">
          Reglas del <span className="gradient-text">PokéTrivia Survival Master</span>
        </h1>
        <p className="hero-subtitle">
          Aprende el funcionamiento del modo supervivencia infinito, el consumo estricto de vidas,
          los multiplicadores de racha y el sistema de pistas con penalización equilibrada.
        </p>
      </div>

      <div className="instructions-grid">
        {/* 1. Supervivencia Infinita */}
        <div className="instruction-card">
          <div className="card-header-icon">
            <Sparkles size={24} />
          </div>
          <h3>1. Partidas Infinitas de Supervivencia</h3>
          <p>
            No existe un límite fijo de 10 o 20 preguntas. Mientras tengas vidas disponibles,
            la partida continuará indefinidamente.
          </p>
          <ul className="instruction-list">
            <li>Cada respuesta correcta suma puntos y aumenta tu racha.</li>
            <li>La dificultad escala progresivamente (Fácil → Intermedio → Difícil → Élite).</li>
            <li>Las preguntas provienen en tiempo real de <strong>PokeAPI v2</strong> con múltiples variantes.</li>
          </ul>
        </div>

        {/* 2. Dificultades y Vidas */}
        <div className="instruction-card">
          <div className="card-header-icon">
            <Heart size={24} className="icon-heart" />
          </div>
          <h3>2. Dificultades y Vidas Iniciales</h3>
          <p>
            La dificultad determina la generación de videojuegos y la resistencia del entrenador:
          </p>
          <div className="levels-explanation">
            <div className="level-item-desc">
              <strong>Principiante (Gen 1 - Kanto):</strong>
              <span>❤️ 5 vidas iniciales, +100 puntos base por acierto.</span>
            </div>
            <div className="level-item-desc">
              <strong>Avanzado (Gen 2 - Johto):</strong>
              <span>❤️ 4 vidas iniciales, +200 puntos base por acierto.</span>
            </div>
            <div className="level-item-desc">
              <strong>Maestro (Gen 3 - Hoenn):</strong>
              <span>❤️ 3 vidas iniciales, +350 puntos base por acierto.</span>
            </div>
          </div>
          <span className="caution-text mt-2">
            ⚠️ Cada error o tiempo agotado consume 1 vida. Responder bien NO recupera vidas.
          </span>
        </div>

        {/* 3. Rachas y Multiplicadores */}
        <div className="instruction-card">
          <div className="card-header-icon">
            <Flame size={24} className="icon-gold" />
          </div>
          <h3>3. Sistema de Racha (Streak)</h3>
          <p>
            Encadenar aciertos consecutivos activa multiplicadores de puntuación:
          </p>
          <ul className="instruction-list">
            <li><strong>Racha 1 - 4:</strong> Multiplicador x1.0</li>
            <li><strong>Racha 5 - 9:</strong> Multiplicador x1.25</li>
            <li><strong>Racha 10 - 19:</strong> Multiplicador x1.50</li>
            <li><strong>Racha 20 - 29:</strong> Multiplicador x1.75</li>
            <li><strong>Racha 30+:</strong> Multiplicador x2.0</li>
          </ul>
          <span className="caution-text">Un solo error rompe la racha a cero.</span>
        </div>

        {/* 4. Sistema de Pistas */}
        <div className="instruction-card">
          <div className="card-header-icon">
            <Zap size={24} />
          </div>
          <h3>4. Sistema de Pistas y Penalización</h3>
          <p>
            Comienzas con 5 pistas por defecto (ampliable con Pase Premium). Tipos disponibles:
          </p>
          <ul className="instruction-list">
            <li><Ban size={16} /> <strong>Descarte 50/50:</strong> Elimina 1 opción incorrecta.</li>
            <li><Eye size={16} /> <strong>Revelar Atributo:</strong> Muestra tipos y dimensiones.</li>
            <li><FileText size={16} /> <strong>Pista Textual:</strong> Ofrece descripción oficial.</li>
          </ul>
          <div className="penalty-box">
            <strong>Penalización en puntos:</strong>
            <p>Sin pistas: 100% | 1 pista: 75% | 2 pistas: 50% de los puntos base.</p>
          </div>
        </div>

        {/* 5. Récords y Clasificación Mundial */}
        <div className="instruction-card">
          <div className="card-header-icon">
            <Trophy size={24} className="icon-gold" />
          </div>
          <h3>5. Récords y Clasificación Mundial</h3>
          <p>
            Tus logros perduran y compiten en el Salón de la Fama:
          </p>
          <ul className="instruction-list">
            <li><strong>Récords Independientes:</strong> Cada dificultad mantiene su propia marca máxima sin sobreescribirse.</li>
            <li><strong>Puntos Acumulados:</strong> Toda partida suma puntos a tu cuenta de entrenador visible en tu perfil.</li>
            <li><strong>Ranking Global:</strong> Consulta las mejores marcas mundiales filtrando por Generación o General.</li>
          </ul>
        </div>

        {/* 6. Reglas de Salida Segura */}
        <div className="instruction-card">
          <div className="card-header-icon">
            <ShieldAlert size={24} />
          </div>
          <h3>6. Reglas de Salida Segura</h3>
          <p>
            Protegemos tu avance ante clics accidentales:
          </p>
          <ul className="instruction-list">
            <li><strong>Salir de la Partida:</strong> Puedes abandonar en cualquier momento. El temporizador se pausa y se te pedirá confirmación. Al salir, se guarda tu puntuación alcanzada.</li>
            <li><strong>Cerrar Sesión:</strong> Tus puntos acumulados, partidas jugadas, récords y avatar permanecerán intactos en tu cuenta.</li>
          </ul>
        </div>
      </div>

      <div className="instructions-cta">
        <Link to="/jugador" className="btn btn-primary btn-lg">
          <Play size={20} className="fill-current" />
          <span>¡Entendido! Ir a la Arena de Supervivencia</span>
        </Link>
      </div>
    </div>
  );
};
