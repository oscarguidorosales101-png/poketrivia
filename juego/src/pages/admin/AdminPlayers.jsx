import React, { useState, useEffect } from 'react';
import { Users, Shield, Zap, Search } from 'lucide-react';

export const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPlayers(data);
      })
      .catch(() => {
        setPlayers([
          {
            id: 'usr-player',
            username: 'ash',
            name: 'Ash Ketchum',
            role: 'PLAYER',
            hints: 5,
            subscription: { plan: 'Plan Gratuito', type: 'FREE', status: 'active' },
            highScore: 400,
            bestStreak: 6,
            matches: 8
          },
          {
            id: 'usr-admin',
            username: 'oak',
            name: 'Profesor Oak',
            role: 'ADMIN',
            hints: 99,
            subscription: { plan: 'Pase Maestro (2 Meses)', type: 'PREMIUM', status: 'active' },
            highScore: 850,
            bestStreak: 15,
            matches: 24
          },
          {
            id: 'usr-player-2',
            username: 'misty',
            name: 'Misty Waterflower',
            role: 'PLAYER',
            hints: 15,
            subscription: { plan: 'Pase Mensual', type: 'PREMIUM', status: 'active' },
            highScore: 600,
            bestStreak: 9,
            matches: 12
          }
        ]);
      });
  }, []);

  const filtered = players.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestión de Jugadores</h1>
          <p className="admin-page-sub">
            Listado de entrenadores registrados, suscripciones de la Liga y estados de cuenta.
          </p>
        </div>
      </div>

      <div className="admin-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="input-search"
            placeholder="Buscar por nombre o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Entrenador</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Pistas</th>
              <th>Suscripción</th>
              <th>Récord Principiante</th>
              <th>Récord Avanzado</th>
              <th>Récord Maestro</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => (
              <tr key={player.id}>
                <td className="font-bold text-main">{player.name}</td>
                <td className="font-mono text-muted">@{player.username}</td>
                <td>
                  <span className={`badge-role ${player.role === 'ADMIN' ? 'role-admin' : 'role-player'}`}>
                    {player.role}
                  </span>
                </td>
                <td className="font-bold">{player.hints ?? 5}</td>
                <td>
                  <span className={`sub-status-pill ${player.subscription?.type === 'PREMIUM' ? 'sub-premium' : 'sub-free'}`}>
                    {player.subscription?.plan || 'Plan Gratuito'}
                  </span>
                </td>
                <td className="score-cell">400 pts</td>
                <td className="score-cell">380 pts</td>
                <td className="score-cell">500 pts</td>
                <td>
                  <span className="status-pill active">Activo</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
