// Página de Glampings: formulario, tarjetas y tabla con diseño solicitado
import React, { useEffect, useState } from 'react';
// Importa el layout principal para la estructura de la página
import MainLayout from '../templates/MainLayout';

// Exporta el componente GlampingsPage para ser usado en las rutas de App.jsx
export default function GlampingsPage() {
  const [glampings, setGlampings] = useState([]);
  const [form, setForm] = useState({ nombre: '', capacidad: '', precio: '', caracteristicas: '', disponible: 'Sí' });

  useEffect(() => {
    fetch('/src/data/glampings.json')
      .then(res => res.json())
      .then(data => setGlampings(data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nombre || !form.capacidad || !form.precio || !form.caracteristicas) return;
    const nuevoGlamping = {
      id: glampings.length + 1,
      nombre: form.nombre,
      capacidad: form.capacidad,
      precio: form.precio,
      caracteristicas: form.caracteristicas,
      disponible: form.disponible
    };
    setGlampings([...glampings, nuevoGlamping]);
    setForm({ nombre: '', capacidad: '', precio: '', caracteristicas: '', disponible: 'Sí' });
  };

  return (
    <MainLayout>
      <div className="glamping-main-container">
        <div className="glamping-form-container">
          <h2>Nuevo Glamping</h2>
          <form onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input name="nombre" type="text" value={form.nombre} onChange={handleChange} />
            <label>Capacidad</label>
            <input name="capacidad" type="number" value={form.capacidad} onChange={handleChange} />
            <label>Precio por noche</label>
            <input name="precio" type="number" value={form.precio} onChange={handleChange} />
            <label>Características</label>
            <textarea name="caracteristicas" value={form.caracteristicas} onChange={handleChange} />
            <label>Disponible</label>
            <select name="disponible" value={form.disponible} onChange={handleChange}>
              <option>Sí</option>
              <option>No</option>
            </select>
            <button type="submit">Guardar</button>
          </form>
        </div>
        {/* Título y Tarjetas de Glampings */}
        <div className="glamping-cards-section">
          <h3 style={{marginBottom: '15px', textAlign: 'left', color: '#153060'}}>Lista de Glampings</h3>
          <div className="glamping-cards-row">
            {glampings.slice(0, 3).map(g => (
              <div className="glamping-card" key={g.id}>
                <div className="glamping-card-title">{g.nombre}</div>
                <div className="glamping-card-content">
                  <div className="glamping-info">
                    <div><strong>Capacidad:</strong> {g.capacidad} personas</div>
                    <div><strong>Precio por noche:</strong> ${g.precio}</div>
                    <div className="glamping-badge">Disponible</div>
                  </div>
                  <div className="glamping-card-buttons">
                    <button className="detalles">Ver detalles</button>
                    <button className="editar">Editar</button>
                    <button className="eliminar">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tabla de Glampings */}
        <div className="glamping-table-container">
          <table className="glamping-table">
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
                  <td>${g.precio}</td>
                  <td>{g.disponible}</td>
                  <td className="glamping-table-actions">
                    <button className="detalles">Detalles</button>
                    <button className="editar">Editar</button>
                    <button className="eliminar">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
