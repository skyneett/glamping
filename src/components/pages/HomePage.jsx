// Página principal (Dashboard)
import React from 'react';
// Importa el layout principal y los componentes de tarjetas para el dashboard
import MainLayout from '../templates/MainLayout';
import DashboardCard from '../molecules/DashboardCard';
import DashboardCards from '../organisms/DashboardCards';
import Button from '../atoms/Button';

// Exporta el componente HomePage para ser usado en las rutas de App.jsx
export default function HomePage() {
  const cards = [
    <DashboardCard title="Clientes" description="Gestione la información de sus clientes.">
      <Button onClick={() => window.location.href = '/clientes'}>Ver Clientes</Button>
    </DashboardCard>,
    <DashboardCard title="Glampings" description="Administre los glampings disponibles.">
      <Button onClick={() => window.location.href = '/glampings'}>Ver Glampings</Button>
    </DashboardCard>,
    <DashboardCard title="Reservas" description="Gestione las reservas de los glampings.">
      <Button onClick={() => window.location.href = '/reservas'}>Ver Reservas</Button>
    </DashboardCard>
  ];

  return (
    <MainLayout>
      <div className="container">
        <h2>Bienvenido al Sistema de Gestión de Glamping</h2>
        <p>Este sistema le permite administrar clientes, glampings y reservas de manera eficiente.</p>
        <DashboardCards cards={cards} />
      </div>
    </MainLayout>
  );
}
