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
      <div style={{ maxWidth: 900, margin: '40px auto 0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'left', marginTop: 50, marginBottom: 40, marginLeft: '16px' }}>
          <h2 style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 14, marginTop: 0 }}>
            Bienvenido al Sistema de Gestión de Glamping
          </h2>
          <p style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, fontWeight: 400, color: '#666', margin: 0 }}>
            Este sistema le permite administrar clientes, glampings y reservas de manera eficiente.
          </p>
        </div>
        <DashboardCards cards={cards} />
      </div>
    </MainLayout>
  );
}
