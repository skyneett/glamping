// Template: Layout general con header y footer
import React from 'react';

export default function MainLayout({ children }) {
  return (
    <>
      <header>
        <h1>Sistema de Gestión de Glamping</h1>
        <nav>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
            <li><a href="/">Inicio</a></li>
            <li><a href="/clientes">Clientes</a></li>
            <li><a href="/glampings">Glampings</a></li>
            <li><a href="/reservas">Reservas</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2025 Sistema de Gestión de Glamping. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
