import React from 'react';
import { Sliders, Heart, Award, Flame, Zap } from 'lucide-react';
import { LEVEL_CONFIG } from '../../utils/helpers';

export const AdminDifficulties = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Configuración de Dificultades y Supervivencia</h1>
          <p className="admin-page-sub">
            Reglas de juego, vidas iniciales, puntos base y tablas de progresión de la arena.
          </p>
        </div>
      </div>

      {/* Tarjetas de Dificultades */}
      <div className="difficulty-settings-grid">
        <div className="diff-card-admin">
          <div className="dca-header">
            <span className="level-badge diff-principiante">Principiante</span>
            <span className="dca-gen">Generación 1</span>
          </div>
          <h3 className="dca-title">Kanto Survival</h3>
          <ul className="dca-specs-list">
            <li><Heart size={16} className="icon-heart" /> <strong>5 Vidas iniciales</strong> (5 → 4 → 3 → 2 → 1 → 0)</li>
            <li><Award size={16} className="icon-gold" /> <strong>+100 puntos base</strong> por acierto</li>
            <li>⏱️ <strong>15 segundos</strong> por pregunta</li>
            <li>🛡️ Silueta con contraste suave</li>
          </ul>
        </div>

        <div className="diff-card-admin">
          <div className="dca-header">
            <span className="level-badge diff-avanzado">Avanzado</span>
            <span className="dca-gen">Generación 2</span>
          </div>
          <h3 className="dca-title">Johto Survival</h3>
          <ul className="dca-specs-list">
            <li><Heart size={16} className="icon-heart" /> <strong>4 Vidas iniciales</strong> (4 → 3 → 2 → 1 → 0)</li>
            <li><Award size={16} className="icon-gold" /> <strong>+200 puntos base</strong> por acierto</li>
            <li>⏱️ <strong>12 segundos</strong> por pregunta</li>
            <li>🛡️ Silueta con contraste intermedio</li>
          </ul>
        </div>

        <div className="diff-card-admin">
          <div className="dca-header">
            <span className="level-badge diff-maestro">Maestro</span>
            <span className="dca-gen">Generación 3</span>
          </div>
          <h3 className="dca-title">Hoenn Survival</h3>
          <ul className="dca-specs-list">
            <li><Heart size={16} className="icon-heart" /> <strong>3 Vidas iniciales</strong> (3 → 2 → 1 → 0)</li>
            <li><Award size={16} className="icon-gold" /> <strong>+350 puntos base</strong> por acierto</li>
            <li>⏱️ <strong>10 segundos</strong> por pregunta</li>
            <li>🛡️ Silueta con contraste total oscuro</li>
          </ul>
        </div>
      </div>

      {/* Tablas de Progresión y Rachas */}
      <div className="admin-panels-row">
        <div className="admin-panel-box">
          <h3 className="panel-box-title">
            <Sliders size={18} />
            <span>Escalado Progresivo de Dificultad (Durante la Partida)</span>
          </h3>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rango de Preguntas</th>
                  <th>Nivel Progresivo</th>
                  <th>Tipo de Desafío</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Preguntas 1 - 10</td>
                  <td><span className="status-pill active">Fácil</span></td>
                  <td>Identificación directa de Pokémon iniciales y populares</td>
                </tr>
                <tr>
                  <td>Preguntas 11 - 25</td>
                  <td><span className="status-pill pending">Intermedio</span></td>
                  <td>Identificación con silueta oscura y tipos elementales</td>
                </tr>
                <tr>
                  <td>Preguntas 26 - 50</td>
                  <td><span className="status-pill warning">Difícil</span></td>
                  <td>Preguntas comparativas de estadísticas y generaciones</td>
                </tr>
                <tr>
                  <td>Pregunta 51+</td>
                  <td><span className="status-pill danger">Muy Difícil</span></td>
                  <td>Especies complejas con tiempo de respuesta exigente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel-box">
          <h3 className="panel-box-title">
            <Flame size={18} className="icon-gold" />
            <span>Multiplicadores de Racha (Streak)</span>
          </h3>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Racha</th>
                  <th>Multiplicador</th>
                  <th>Principiante</th>
                  <th>Avanzado</th>
                  <th>Maestro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 - 4</td>
                  <td className="font-bold">x1.0</td>
                  <td>100 pts</td>
                  <td>200 pts</td>
                  <td>350 pts</td>
                </tr>
                <tr>
                  <td>5 - 9</td>
                  <td className="font-bold text-success">x1.25</td>
                  <td>125 pts</td>
                  <td>250 pts</td>
                  <td>438 pts</td>
                </tr>
                <tr>
                  <td>10 - 19</td>
                  <td className="font-bold text-blue">x1.50</td>
                  <td>150 pts</td>
                  <td>300 pts</td>
                  <td>525 pts</td>
                </tr>
                <tr>
                  <td>20 - 29</td>
                  <td className="font-bold text-gold">x1.75</td>
                  <td>175 pts</td>
                  <td>350 pts</td>
                  <td>613 pts</td>
                </tr>
                <tr>
                  <td>30+</td>
                  <td className="font-bold text-red">x2.0</td>
                  <td>200 pts</td>
                  <td>400 pts</td>
                  <td>700 pts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
