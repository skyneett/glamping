// Molécula: Tarjeta simple para dashboard
import React from 'react';

export default function DashboardCard({ title, description, children }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
