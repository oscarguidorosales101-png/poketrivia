import React from 'react';
import { Sparkles, Ban, Eye, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdminHints = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestión y Métricas del Sistema de Pistas</h1>
          <p className="admin-page-sub">
            Reglas de penalización equilibrada, tipos de ayudas disponibles y consumo de pistas en partidas.
          </p>
        </div>
      </div>

      {/* Tipos de Pistas */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-purple">
            <Ban size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Tipo 1: Descarte 50/50</span>
            <span className="admin-stat-val">45% de uso</span>
            <span className="admin-stat-trend">Elimina 1 opción incorrecta de la pantalla</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-blue">
            <Eye size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Tipo 2: Revelar Atributo</span>
            <span className="admin-stat-val">35% de uso</span>
            <span className="admin-stat-trend">Muestra el tipo elemental principal y medidas</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <FileText size={22} />
          </div>
          <div>
            <span className="admin-stat-label">Tipo 3: Pista Textual</span>
            <span className="admin-stat-val">20% de uso</span>
            <span className="admin-stat-trend">Proporciona un dato descriptivo oficial de la especie</span>
          </div>
        </div>
      </div>

      {/* Tabla de Penalización */}
      <div className="admin-panel-box">
        <h3 className="panel-box-title">
          <AlertTriangle size={18} className="icon-gold" />
          <span>Matriz de Penalización de Puntos por Pistas</span>
        </h3>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pistas Usadas en la Pregunta</th>
                <th>Porcentaje de Puntos</th>
                <th>Principiante (Base 100)</th>
                <th>Avanzado (Base 200)</th>
                <th>Maestro (Base 350)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0 Pistas (Sin ayuda)</td>
                <td><span className="status-pill active">100% de puntos</span></td>
                <td>100 pts</td>
                <td>200 pts</td>
                <td>350 pts</td>
              </tr>
              <tr>
                <td>1 Pista utilizada</td>
                <td><span className="status-pill pending">75% de puntos</span></td>
                <td>75 pts</td>
                <td>150 pts</td>
                <td>263 pts</td>
              </tr>
              <tr>
                <td>2 Pistas utilizadas</td>
                <td><span className="status-pill danger">50% de puntos</span></td>
                <td>50 pts</td>
                <td>100 pts</td>
                <td>175 pts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="admin-note-box">
          <ShieldCheck size={18} />
          <p>
            <strong>Regla de equilibrio:</strong> Los multiplicadores de racha se aplican <em>después</em> de
            deducir la penalización por pistas, redondeando el puntaje al número entero más cercano. No se permiten
            puntuaciones negativas ni saldos de pistas inferiores a cero.
          </p>
        </div>
      </div>
    </div>
  );
};
