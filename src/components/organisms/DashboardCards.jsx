// Organismo: Listado de tarjetas para el dashboard
import React from 'react';

export default function DashboardCards({ cards }) {
  return (
    <div className="dashboard-cards">
      {cards.map((card, idx) => (
        <div key={idx}>{card}</div>
      ))}
    </div>
  );
}
