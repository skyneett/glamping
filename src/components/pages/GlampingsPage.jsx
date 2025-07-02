// Página de Glampings: formulario, tarjetas y tabla con diseño solicitado
import React, { useEffect, useState } from 'react';
// Importa el layout principal para la estructura de la página
import MainLayout from '../templates/MainLayout';

// Exporta el componente GlampingsPage para ser usado en las rutas de App.jsx
export default function GlampingsPage() {
  const [glampings, setGlampings] = useState([]);
  const [form, setForm] = useState({ nombre: '', capacidad: '', precio: '', caracteristicas: '', disponible: 'true' });
  const [editandoId, setEditandoId] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const [showModal, setShowModal] = useState(false);
  const [glampingAEliminar, setGlampingAEliminar] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);
  const [glampingDetalles, setGlampingDetalles] = useState(null);
  // Simulación de reservas asociadas (puedes reemplazar por lógica real)
  const reservas = [
    // { glampingId: 2, ... }
  ];



  // Cargar glampings desde la API
  useEffect(() => {
    fetch('http://localhost:3001/glampings')
      .then(res => res.json())
      .then(data => setGlampings(data));
  }, []);

  const validar = (datos) => {
    const errores = {};
    if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio';
    if (!datos.capacidad || isNaN(datos.capacidad) || Number(datos.capacidad) < 1) errores.capacidad = 'Capacidad debe ser mayor a 0';
    if (!datos.precio || isNaN(datos.precio) || Number(datos.precio) < 0) errores.precio = 'Precio inválido';
    if (!datos.caracteristicas.trim()) errores.caracteristicas = 'Características obligatorias';
    return errores;
  };

  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta({ mensaje: '', tipo: '' }), 3000);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const nuevosErrores = validar(form);
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarAlerta(
        <span>Por favor corrija los siguientes errores:<ul>{Object.values(nuevosErrores).map((err, i) => <li key={i}>{err}</li>)}</ul></span>,
        'danger'
      );
      return;
    }
    if (editandoId) {
      // Actualizar glamping existente (solo en memoria, podrías agregar un endpoint PUT en el backend si lo deseas)
      const actualizados = glampings.map(g =>
        g.id === editandoId ? {
          ...g,
          ...form,
          caracteristicas: form.caracteristicas.split(',').map(c => c.trim()).filter(Boolean),
          disponible: form.disponible
        } : g
      );
      setGlampings(actualizados);
      mostrarAlerta('Glamping actualizado con éxito', 'success');
      resetearFormulario();
    } else {
      // Crear nuevo glamping (POST a la API)
      const nuevoGlamping = {
        id: glampings.length > 0 ? Math.max(...glampings.map(g => g.id)) + 1 : 1,
        nombre: form.nombre,
        capacidad: form.capacidad,
        precio: form.precio,
        caracteristicas: form.caracteristicas.split(',').map(c => c.trim()).filter(Boolean),
        disponible: form.disponible
      };
      fetch('http://localhost:3001/glampings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoGlamping)
      })
        .then(res => res.json())
        .then(data => {
          setGlampings([...glampings, data]);
          mostrarAlerta('Glamping creado con éxito', 'success');
          resetearFormulario();
        });
    }
  };

  const handleEditar = (glamping) => {
    setForm({
      nombre: glamping.nombre,
      capacidad: glamping.capacidad,
      precio: glamping.precio,
      caracteristicas: Array.isArray(glamping.caracteristicas) ? glamping.caracteristicas.join(', ') : glamping.caracteristicas,
      disponible: glamping.disponible
    });
    setEditandoId(glamping.id);
  };

  const resetearFormulario = () => {
    setForm({ nombre: '', capacidad: '', precio: '', caracteristicas: '', disponible: 'true' });
    setEditandoId(null);
  };

  const handleEliminar = (glamping) => {
    // Simula bloqueo si tiene reservas asociadas
    const tieneReservas = reservas.some(r => r.glampingId === glamping.id);
    if (tieneReservas) {
      mostrarAlerta('No se puede eliminar el glamping porque tiene reservas asociadas.', 'danger');
      return;
    }
    setGlampingAEliminar(glamping);
    setShowModal(true);
  };

  const confirmarEliminar = () => {
    setGlampings(glampings.filter(g => g.id !== glampingAEliminar.id));
    setShowModal(false);
    setGlampingAEliminar(null);
    mostrarAlerta('Glamping eliminado con éxito', 'success');
    if (editandoId === glampingAEliminar.id) resetearFormulario();
  };

  const cancelarEliminar = () => {
    setShowModal(false);
    setGlampingAEliminar(null);
  };

  const handleDetalles = (glamping) => {
    setGlampingDetalles(glamping);
    setShowDetalles(true);
  };

  const cerrarDetalles = () => {
    setShowDetalles(false);
    setGlampingDetalles(null);
  };

  return (
    <MainLayout>
      <div className="container">
        <h2>Gestión de Glampings</h2>
        <div id="alerts-container">
          {alerta.mensaje && (
            <div className={`alert alert-${alerta.tipo}`}>{alerta.mensaje}</div>
          )}
        </div>
        <div className="form-container">
          <h3>Nuevo Glamping</h3>
          <form onSubmit={handleSubmit} id="form-glamping">
            {/* <input type="hidden" id="glamping-id" /> */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input name="nombre" id="nombre" type="text" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="capacidad">Capacidad</label>
              <input name="capacidad" id="capacidad" type="number" min="1" value={form.capacidad} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio por noche</label>
              <input name="precio" id="precio" type="number" min="0" value={form.precio} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="caracteristicas">Características (separadas por coma)</label>
              <textarea name="caracteristicas" id="caracteristicas" value={form.caracteristicas} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="disponible">Disponible</label>
              <select name="disponible" id="disponible" value={form.disponible} onChange={handleChange}>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="success">{editandoId ? 'Actualizar' : 'Guardar'}</button>
              {editandoId && (
                <button type="button" className="btn-cancelar" style={{marginLeft:8}} onClick={resetearFormulario}>Cancelar</button>
              )}
            </div>
          </form>
        </div>
        {/* Tarjetas de Glampings */}
        <div className="glamping-cards-section" style={{width: '100%', margin: 0, padding: 0, alignItems: 'flex-start'}}>
          <h3 className="glamping-cards-title" style={{marginLeft: 0}}>Lista de Glampings</h3>
          <div className="glamping-cards-row" style={{justifyContent: 'flex-start'}}>
            {glampings.map(g => (
              <div className="glamping-card" key={g.id}>
                <div className="glamping-card-title">{g.nombre}</div>
                <div className="glamping-card-content">
                  <div className="glamping-info">
                    <div><strong>Capacidad:</strong> {g.capacidad} personas</div>
                    <div><strong>Precio por noche:</strong> ${Number(g.precio).toLocaleString()}</div>
                    {g.disponible === 'true' || g.disponible === true ? (
                      <div className="glamping-badge disponible">Disponible</div>
                    ) : (
                      <div className="glamping-badge no-disponible">No disponible</div>
                    )}
                  </div>
                  <div className="glamping-card-buttons">
                    <button className="detalles" onClick={() => handleDetalles(g)}>Ver detalles</button>
                    <button className="editar" onClick={() => handleEditar(g)}>Editar</button>
                    <button className="eliminar" onClick={() => handleEliminar(g)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tabla de Glampings */}
        <div className="table-container">
          <table id="tabla-glampings">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Capacidad</th>
                <th>Precio/Noche</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {glampings.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.nombre}</td>
                  <td>{g.capacidad}</td>
                  <td>${Number(g.precio).toLocaleString()}</td>
                  <td>{g.disponible === 'true' || g.disponible === true ? 'Sí' : 'No'}</td>
                  <td className="action-buttons">
                    <button className="detalles" onClick={() => handleDetalles(g)}>Detalles</button>
                    <button className="editar" onClick={() => handleEditar(g)}>Editar</button>
                    <button className="eliminar" onClick={() => handleEliminar(g)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de detalles */}
        {showDetalles && glampingDetalles && (
          <div className="modal" style={{display:'flex'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Detalles del Glamping</h2>
                <button className="close-modal" onClick={cerrarDetalles}>&times;</button>
              </div>
              <div className="modal-body">
                <h3>{glampingDetalles.nombre}</h3>
                <p><strong>ID:</strong> {glampingDetalles.id}</p>
                <p><strong>Capacidad:</strong> {glampingDetalles.capacidad} personas</p>
                <p><strong>Precio por noche:</strong> ${Number(glampingDetalles.precio).toLocaleString()}</p>
                <p><strong>Disponible:</strong> {glampingDetalles.disponible === 'true' || glampingDetalles.disponible === true ? 'Sí' : 'No'}</p>
                <h4>Características:</h4>
                <ul>
                  {(() => {
                    let caracs = glampingDetalles.caracteristicas;
                    if (Array.isArray(caracs)) return caracs.map((c, i) => <li key={i}>{c}</li>);
                    if (typeof caracs === 'string') return caracs.split(',').map((c, i) => <li key={i}>{c.trim()}</li>);
                    return <li>No especificadas</li>;
                  })()}
                </ul>
                {/* Aquí podrías mostrar reservas asociadas si las tienes */}
              </div>
            </div>
          </div>
        )}
        {/* Modal de confirmación */}
        {showModal && (
          <div className="modal" style={{display:'flex'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Confirmar eliminación</h2>
                <button className="close-modal" onClick={cancelarEliminar}>&times;</button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea eliminar este glamping? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button id="btn-confirmar-eliminar" className="danger" onClick={confirmarEliminar}>Eliminar</button>
                <button className="close-modal" onClick={cancelarEliminar}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
