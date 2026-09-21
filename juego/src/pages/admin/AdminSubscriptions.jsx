import React, { useState, useEffect } from 'react';
import { Zap, Calendar, Users, CheckCircle2, Shield } from 'lucide-react';

const SUBSCRIPTION_MODELS = [
  {
    id: 'sub-free',
    name: 'Plan Gratuito (FREE)',
    type: 'FREE',
    duration: 'Indefinido',
    durationMonths: 0,
    price: 'Gratis',
    hintsBonus: '5 pistas iniciales',
    features: ['Acceso a las 3 dificultades', 'Historial estándar', 'Tabla de líderes global'],
    activeUsers: 1
  },
  {
    id: 'sub-1',
    name: 'Pase Mensual',
    type: 'PREMIUM',
    duration: '1 Mes',
    durationMonths: 1,
    price: '$4.99 USD',
    hintsBonus: '+20 pistas recargables',
    features: ['+20 pistas para partidas', 'Historial completo de estadísticas', 'Insignia de Entrenador Destacado'],
    activeUsers: 42
  },
  {
    id: 'sub-2',
    name: 'Pase Élite',
    type: 'PREMIUM',
    duration: '1.5 Meses (45 días)',
    durationMonths: 1.5,
    price: '$6.99 USD',
    hintsBonus: '+35 pistas recargables',
    features: ['+35 pistas adicionales', 'Soporte prioritario de la Liga', 'Análisis detallado de rachas'],
    activeUsers: 28
  },
  {
    id: 'sub-3',
    name: 'Pase Maestro',
    type: 'PREMIUM',
    duration: '2 Meses (60 días)',
    durationMonths: 2,
    price: '$8.99 USD',
    hintsBonus: '+50 pistas recargables',
    features: ['+50 pistas de supervivencia', 'Acceso anticipado a variantes', 'Insignia Dorada de la Liga'],
    activeUsers: 65
  }
];

export const AdminSubscriptions = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Planes de Suscripción de la Liga Pokémon</h1>
          <p className="admin-page-sub">
            Modelos de duración (1 mes, 1.5 meses, 2 meses) y beneficios Premium para entrenadores.
          </p>
        </div>
      </div>

      <div className="subscriptions-cards-grid">
        {SUBSCRIPTION_MODELS.map((plan) => (
          <div key={plan.id} className={`sub-plan-card ${plan.type === 'PREMIUM' ? 'premium-border' : ''}`}>
            <div className="sub-plan-header">
              <span className={`sub-status-pill ${plan.type === 'PREMIUM' ? 'sub-premium' : 'sub-free'}`}>
                {plan.type}
              </span>
              <span className="sub-plan-users">
                <Users size={14} /> {plan.activeUsers} activos
              </span>
            </div>

            <h3 className="sub-plan-title">{plan.name}</h3>
            <span className="sub-plan-price">{plan.price}</span>
            <span className="sub-plan-duration">Duración: {plan.duration}</span>

            <div className="sub-bonus-box">
              <Zap size={16} className="icon-gold" />
              <span>{plan.hintsBonus}</span>
            </div>

            <ul className="sub-features-list">
              {plan.features.map((feat, i) => (
                <li key={i}>
                  <CheckCircle2 size={14} className="icon-check" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
