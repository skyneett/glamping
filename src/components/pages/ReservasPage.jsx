// Página de Reservas: formulario, filtros, tabla y calendario
import React, { useEffect, useState } from 'react';
import MainLayout from '../templates/MainLayout';

export default function ReservasPage() {
  const [clientes, setClientes] = useState([]);
  const [glampings, setGlampings] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({ cliente: '', glamping: '', fechaInicio: '', fechaFin: '', total: '', estado: 'Pendiente' });
  const [filtros, setFiltros] = useState({ cliente: '', glamping: '', estado: '' });
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch('/src/data/clientes.json').then(res => res.json()).then(setClientes);
    fetch('/src/data/glampings.json').then(res => res.json()).then(setGlampings);
    fetch('/src/data/reservas.json').then(res => res.json()).then(setReservas);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiltroChange = e => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.cliente || !form.glamping || !form.fechaInicio || !form.fechaFin || !form.total) return;
    const nuevo = {
      id: reservas.length + 1,
      cliente: form.cliente,
      glamping: form.glamping,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      total: form.total,
      estado: form.estado
    };
    setReservas([...reservas, nuevo]);
    setForm({ cliente: '', glamping: '', fechaInicio: '', fechaFin: '', total: '', estado: 'Pendiente' });
  };

  const reservasFiltradas = reservas.filter(r =>
    (!filtros.cliente || r.cliente === filtros.cliente) &&
    (!filtros.glamping || r.glamping === filtros.glamping) &&
    (!filtros.estado || r.estado === filtros.estado)
  );

  // --- Calendario simple ---
  const diasEnMes = (mes, anio) => new Date(anio, mes + 1, 0).getDate();
  const primerDia = new Date(anio, mes, 1).getDay();
  const dias = Array.from({ length: diasEnMes(mes, anio) }, (_, i) => i + 1);
  const avanzarMes = () => setMes(m => (m === 11 ? 0 : m + 1)) || (m === 11 && setAnio(anio + 1));
  const retrocederMes = () => setMes(m => (m === 0 ? 11 : m - 1)) || (m === 0 && setAnio(anio - 1));
  const volverHoy = () => { setMes(new Date().getMonth()); setAnio(new Date().getFullYear()); };

  return (
    <MainLayout>
      <div style={{ width: '900px', margin: '40px auto 0 auto' }}>
        <h2 style={{ color: '#153060', marginBottom: 20 }}>Gestión de Reservas</h2>
        {/* Formulario Nueva Reserva */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(21,48,96,0.10)', padding: 30, marginBottom: 30 }}>
          <h3 style={{ marginTop: 0, color: '#153060' }}>Nueva Reserva</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <label>Cliente</label>
              <select name="cliente" value={form.cliente} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }}>
                <option value="">Seleccione...</option>
                {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Glamping</label>
              <select name="glamping" value={form.glamping} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }}>
                <option value="">Seleccione...</option>
                {glampings.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Fecha inicio</label>
              <input name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Fecha fin</label>
              <input name="fechaFin" type="date" value={form.fechaFin} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Total pagado</label>
              <input name="total" type="number" value={form.total} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }}>
                <option>Pendiente</option>
                <option>Confirmada</option>
                <option>Cancelada</option>
              </select>
            </div>
            <div>
              <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', marginTop: 10, width: 140 }}>Guardar</button>
            </div>
          </form>
        </div>
        {/* Filtros */}
        <div style={{ background: '#f8f9fa', borderRadius: 8, boxShadow: '0 1px 6px rgba(21,48,96,0.06)', padding: 20, marginBottom: 30, display: 'flex', gap: 20, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label>Cliente</label>
            <select name="cliente" value={filtros.cliente} onChange={handleFiltroChange} style={{ width: '100%', height: 35 }}>
              <option value="">Todos</option>
              {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label>Glamping</label>
            <select name="glamping" value={filtros.glamping} onChange={handleFiltroChange} style={{ width: '100%', height: 35 }}>
              <option value="">Todos</option>
              {glampings.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label>Estado</label>
            <select name="estado" value={filtros.estado} onChange={handleFiltroChange} style={{ width: '100%', height: 35 }}>
              <option value="">Todos</option>
              <option>Pendiente</option>
              <option>Confirmada</option>
              <option>Cancelada</option>
            </select>
          </div>
          <button onClick={() => {}} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold' }}>Filtrar</button>
          <button onClick={() => setFiltros({ cliente: '', glamping: '', estado: '' })} style={{ background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold' }}>Limpiar</button>
        </div>
        {/* Tabla de Reservas */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(21,48,96,0.10)', padding: 20, marginBottom: 40 }}>
          <h3 style={{ color: '#153060', marginBottom: 15 }}>Lista de Reservas</h3>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#153060', color: '#fff', height: 40 }}>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>ID</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Cliente</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Glamping</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Fecha Inicio</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Fecha Fin</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Total Pagado</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Estado</th>
                <th style={{ background: '#153060', color: '#fff', fontWeight: 'bold' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map(r => (
                <tr key={r.id} style={{ background: '#fff', textAlign: 'center' }}>
                  <td>{r.id}</td>
                  <td>{r.cliente}</td>
                  <td>{r.glamping}</td>
                  <td>{r.fechaInicio}</td>
                  <td>{r.fechaFin}</td>
                  <td>${r.total}</td>
                  <td>{r.estado}</td>
                  <td style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }}>Detalles</button>
                    <button style={{ background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }}>Editar</button>
                    <button style={{ background: '#ffc107', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }}>Estado</button>
                    <button style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Calendario de Reservas (estructura base) */}
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(21,48,96,0.10)', padding: 20, marginBottom: 40 }}>
          <h3 style={{ color: '#153060', marginBottom: 15 }}>Calendario de Reservas</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button onClick={retrocederMes}>&lt;&lt;</button>
            <span style={{ fontWeight: 'bold' }}>{`${anio} - ${mes + 1}`}</span>
            <button onClick={avanzarMes}>&gt;&gt;</button>
            <button onClick={volverHoy} style={{ marginLeft: 20 }}>Hoy</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map(dia => (
              <div key={dia} style={{ fontWeight: 'bold', textAlign: 'center', color: '#153060' }}>{dia}</div>
            ))}
            {Array(primerDia).fill(null).map((_, i) => <div key={'vacio'+i}></div>)}
            {dias.map(dia => {
              // Buscar reservas activas en este día
              const reservasDia = reservasFiltradas.filter(r => {
                const ini = new Date(r.fechaInicio);
                const fin = new Date(r.fechaFin);
                const actual = new Date(anio, mes, dia);
                return actual >= ini && actual <= fin;
              });
              return (
                <div key={dia} style={{ minHeight: 50, border: '1px solid #e3eaf6', borderRadius: 6, background: reservasDia.length ? '#d4edda' : '#f8f9fa', fontSize: 12, padding: 4 }}>
                  <div style={{ fontWeight: 'bold', color: '#153060' }}>{dia}</div>
                  {reservasDia.map((r, idx) => (
                    <div key={idx} style={{ color: '#155724', fontSize: 11, marginTop: 2 }}>
                      {r.cliente} - {r.glamping}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
