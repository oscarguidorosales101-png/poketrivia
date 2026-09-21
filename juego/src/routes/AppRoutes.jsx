import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Páginas de Usuario
import { Home } from '../pages/Home';
import { PlayerDashboard } from '../pages/PlayerDashboard';
import { Game } from '../pages/Game';
import { Results } from '../pages/Results';
import { Instructions } from '../pages/Instructions';
import { Profile } from '../pages/Profile';
import { Leaderboard } from '../pages/Leaderboard';
import { Forbidden403 } from '../pages/Forbidden403';
import { NotFound404 } from '../pages/NotFound404';

// Páginas de Administrador
import { AdminLayout } from '../pages/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminQuestions } from '../pages/admin/AdminQuestions';
import { AdminVariations } from '../pages/admin/AdminVariations';
import { AdminPlayers } from '../pages/admin/AdminPlayers';
import { AdminScores } from '../pages/admin/AdminScores';
import { AdminGenerations } from '../pages/admin/AdminGenerations';
import { AdminDifficulties } from '../pages/admin/AdminDifficulties';
import { AdminHints } from '../pages/admin/AdminHints';
import { AdminSubscriptions } from '../pages/admin/AdminSubscriptions';

/**
 * Configuración central y exclusiva de rutas de la aplicación con React Router v6
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Ruta Pública de Inicio / Login */}
      <Route path="/" element={<Home />} />

      {/* 2. Rutas del Jugador (Protegidas: requiere autenticación) */}
      <Route
        path="/jugador"
        element={
          <ProtectedRoute>
            <PlayerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/juego/:nivel"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 3. Rutas Abiertas de Consulta */}
      <Route path="/clasificacion" element={<Leaderboard />} />
      <Route path="/resultados" element={<Results />} />
      <Route path="/instrucciones" element={<Instructions />} />

      {/* 4. Rutas Administrativas (Protegidas: requiere rol ADMIN) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="preguntas" element={<AdminQuestions />} />
        <Route path="variaciones" element={<AdminVariations />} />
        <Route path="jugadores" element={<AdminPlayers />} />
        <Route path="puntuaciones" element={<AdminScores />} />
        <Route path="generaciones" element={<AdminGenerations />} />
        <Route path="dificultades" element={<AdminDifficulties />} />
        <Route path="pistas" element={<AdminHints />} />
        <Route path="suscripciones" element={<AdminSubscriptions />} />
      </Route>

      {/* 5. Códigos de Error HTTP Visuales */}
      <Route path="/403" element={<Forbidden403 />} />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
