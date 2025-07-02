// Página de Reservas: formulario, filtros, tabla y calendario
import React, { useEffect, useState } from 'react';
import MainLayout from '../templates/MainLayout';

export default function ReservasPage() {
  const [clientes, setClientes] = useState([]);
  const [glampings, setGlampings] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [form, setForm] = useState({ clienteId: '', glampingId: '', fechaInicio: '', fechaFin: '', totalPagado: '', estado: 'pendiente' });
  const [filtros, setFiltros] = useState({ clienteId: '', glampingId: '', estado: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [reservaDetalles, setReservaDetalles] = useState(null);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [reservaEstado, setReservaEstado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('pendiente');
  const [mes, setMes] = useState(new Date().getMonth());
  const [anio, setAnio] = useState(new Date().getFullYear());

  // Cargar datos desde archivos JSON
  // Cargar datos desde la API
  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
    fetch('http://localhost:3001/glampings')
      .then(res => res.json())
      .then(data => setGlampings(data));
    fetch('http://localhost:3001/reservas')
      .then(res => res.json())
      .then(data => setReservas(data));
  }, []);

  // Guardar cambios en reservas (POST a la API)
  const persistirReservas = (nuevasReservas) => {
    const nuevaReserva = nuevasReservas[nuevasReservas.length - 1];
    fetch('http://localhost:3001/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaReserva)
    })
      .then(res => res.json())
      .then(data => {
        setReservas(nuevasReservas);
      });
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiltroChange = e => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.clienteId || !form.glampingId || !form.fechaInicio || !form.fechaFin || !form.totalPagado) return;
    const reservaData = {
      ...form,
      clienteId: Number(form.clienteId),
      glampingId: Number(form.glampingId)
    };
    if (editandoId) {
      // Actualizar reserva existente
      const actualizadas = reservas.map(r =>
        r.id === editandoId
          ? { ...r, ...reservaData, id: editandoId }
          : r
      );
      persistirReservas(actualizadas);
      setAlerta({ mensaje: 'Reserva actualizada con éxito', tipo: 'success' });
      setEditandoId(null);
    } else {
      // Crear nueva reserva
      const nuevo = {
        id: reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1,
        ...reservaData
      };
      persistirReservas([...reservas, nuevo]);
      setAlerta({ mensaje: 'Reserva creada con éxito', tipo: 'success' });
    }
    setForm({ clienteId: '', glampingId: '', fechaInicio: '', fechaFin: '', totalPagado: '', estado: 'pendiente' });
  };

  const handleEditar = r => {
    setEditandoId(r.id);
    setForm({
      clienteId: r.clienteId,
      glampingId: r.glampingId,
      fechaInicio: r.fechaInicio,
      fechaFin: r.fechaFin,
      totalPagado: r.totalPagado,
      estado: r.estado
    });
  };

  const reservasFiltradas = reservas.filter(r =>
    (!filtros.clienteId || r.clienteId === Number(filtros.clienteId)) &&
    (!filtros.glampingId || r.glampingId === Number(filtros.glampingId)) &&
    (!filtros.estado || r.estado === filtros.estado)
  );

  // --- Calendario simple ---
  const diasEnMes = (mes, anio) => new Date(anio, mes + 1, 0).getDate();
  const primerDia = new Date(anio, mes, 1).getDay();
  const dias = Array.from({ length: diasEnMes(mes, anio) }, (_, i) => i + 1);
  const avanzarMes = () => setMes(m => (m === 11 ? 0 : m + 1)) || (mes === 11 && setAnio(anio + 1));
  const retrocederMes = () => setMes(m => (m === 0 ? 11 : m - 1)) || (mes === 0 && setAnio(anio - 1));
  const volverHoy = () => { setMes(new Date().getMonth()); setAnio(new Date().getFullYear()); };

  return (
    <MainLayout>
      <div className="container">
        <h2>Gestión de Reservas</h2>
        <div id="alerts-container">
          {alerta.mensaje && (
            <div className={`alert alert-${alerta.tipo}`}>{alerta.mensaje}</div>
          )}
        </div>
        {/* Formulario Nueva Reserva */}
        <div className="form-container">
          <h3>Nueva Reserva</h3>
          <form id="form-reserva" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <label>Cliente</label>
              <select name="clienteId" value={form.clienteId} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }}>
                <option value="">Seleccione...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Glamping</label>
              <select name="glampingId" value={form.glampingId} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }}>
                <option value="">Seleccione...</option>
                {glampings.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
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
              <input name="totalPagado" type="number" value={form.totalPagado} onChange={handleChange} style={{ width: '100%', height: 35, marginTop: 4 }} />
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
        <div className="filter-container">
          <h3>Filtros</h3>
          <form id="form-filtros" className="filters" style={{ background: '#f8f9fa', borderRadius: 8, boxShadow: '0 1px 6px rgba(21,48,96,0.06)', padding: 20, marginBottom: 30, display: 'flex', gap: 20, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Cliente</label>
              <select name="clienteId" value={filtros.clienteId} onChange={handleFiltroChange} style={{ width: '100%', height: 35 }}>
                <option value="">Todos</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Glamping</label>
              <select name="glampingId" value={filtros.glampingId} onChange={handleFiltroChange} style={{ width: '100%', height: 35 }}>
                <option value="">Todos</option>
                {glampings.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
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
            <button onClick={e => e.preventDefault()} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold' }}>Filtrar</button>
            <button onClick={e => { e.preventDefault(); setFiltros({ clienteId: '', glampingId: '', estado: '' }); }} style={{ background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold' }}>Limpiar</button>
          </form>
        </div>
        <h3>Lista de Reservas</h3>
        <div className="table-container">
          <table id="tabla-reservas" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: 14 }}>
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
                  <td>{clientes.find(c => c.id === r.clienteId)?.nombre}</td>
                  <td>{glampings.find(g => g.id === r.glampingId)?.nombre}</td>
                  <td>{r.fechaInicio}</td>
                  <td>{r.fechaFin}</td>
                  <td>${r.totalPagado}</td>
                  <td>{r.estado}</td>
                  <td style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }} onClick={() => { setReservaDetalles(r); setShowModalDetalles(true); }}>Detalles</button>
                    <button style={{ background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }} onClick={() => handleEditar(r)}>Editar</button>
                    <button style={{ background: '#ffc107', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }} onClick={() => { setReservaEstado(r); setNuevoEstado(r.estado); setShowModalEstado(true); }}>Estado</button>
                    <button style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 12px', fontSize: 12 }} onClick={() => { setReservaAEliminar(r); setShowModalEliminar(true); }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Calendario de Reservas (estructura base) */}
        <div className="calendar-container" style={{marginTop: 20}}>
          <h3>Calendario de Reservas</h3>
          <div className="calendar" id="calendario-reservas">
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
                      <div
                        key={idx}
                        style={{ color: '#155724', fontSize: 11, marginTop: 2, cursor: 'pointer' }}
                        onClick={() => { setReservaDetalles(r); setShowModalDetalles(true); }}
                        title="Ver detalles de la reserva"
                      >
                        {clientes.find(c => c.id === r.clienteId)?.nombre} - {glampings.find(g => g.id === r.glampingId)?.nombre}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Modal Detalles */}
        {showModalDetalles && reservaDetalles && (
          <div className="modal" style={{display:'flex'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Detalles de la Reserva</h2>
                <button className="close-modal" onClick={() => setShowModalDetalles(false)}>&times;</button>
              </div>
              <div className="modal-body" id="detalles-reserva">
                <p><strong>ID:</strong> {reservaDetalles.id}</p>
                <p><strong>Cliente:</strong> {clientes.find(c => c.id === reservaDetalles.clienteId)?.nombre}</p>
                <p><strong>Glamping:</strong> {glampings.find(g => g.id === reservaDetalles.glampingId)?.nombre}</p>
                <p><strong>Fecha Inicio:</strong> {new Date(reservaDetalles.fechaInicio).toLocaleString()}</p>
                <p><strong>Fecha Fin:</strong> {new Date(reservaDetalles.fechaFin).toLocaleString()}</p>
                <p><strong>Total Pagado:</strong> ${reservaDetalles.totalPagado}</p>
                <p><strong>Estado:</strong> {reservaDetalles.estado}</p>
              </div>
            </div>
          </div>
        )}
        {/* Modal Confirmar Eliminar */}
        {showModalEliminar && reservaAEliminar && (
          <div className="modal" style={{display:'flex'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Confirmar eliminación</h2>
                <button className="close-modal" onClick={() => setShowModalEliminar(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea eliminar esta reserva? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button id="btn-confirmar-eliminar" className="danger" onClick={() => {
                  const nuevas = reservas.filter(r => r.id !== reservaAEliminar.id);
                  persistirReservas(nuevas);
                  setShowModalEliminar(false);
                  setAlerta({ mensaje: 'Reserva eliminada con éxito', tipo: 'success' });
                }}>Eliminar</button>
                <button className="close-modal" onClick={() => setShowModalEliminar(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Cambio de Estado */}
        {showModalEstado && reservaEstado && (
          <div className="modal" style={{display:'flex'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Cambiar estado de reserva</h2>
                <button className="close-modal" onClick={() => setShowModalEstado(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="cambio-estado">Nuevo estado</label>
                  <select id="cambio-estado" value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button id="btn-confirmar-estado" className="success" onClick={() => {
                  const nuevas = reservas.map(r => r.id === reservaEstado.id ? { ...r, estado: nuevoEstado } : r);
                  persistirReservas(nuevas);
                  setShowModalEstado(false);
                  setAlerta({ mensaje: 'Estado de reserva actualizado', tipo: 'success' });
                }}>Guardar</button>
                <button className="close-modal" onClick={() => setShowModalEstado(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
