// Página de Clientes: muestra la lista de clientes desde el JSON y permite agregar nuevos
import React, { useEffect, useState } from 'react';
// Importa el layout principal para la estructura de la página
import MainLayout from '../templates/MainLayout';

// Exporta el componente ClientesPage para ser usado en las rutas de App.jsx
export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', documento: '' });

  useEffect(() => {
    fetch('/src/data/clientes.json')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono || !form.documento) return;
    const nuevoCliente = {
      id: clientes.length + 1,
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono,
      documento: form.documento
    };
    setClientes([...clientes, nuevoCliente]);
    setForm({ nombre: '', email: '', telefono: '', documento: '' });
  };

  return (
    <MainLayout>
      <div className="clientes-form-container">
        <h2>Nuevo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre completo</label>
            <input name="nombre" type="text" value={form.nombre} onChange={handleChange} />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label>Teléfono</label>
            <input name="telefono" type="text" value={form.telefono} onChange={handleChange} />
          </div>
          <div>
            <label>Documento</label>
            <input name="documento" type="text" value={form.documento} onChange={handleChange} />
          </div>
          <button type="submit">Guardar</button>
        </form>
      </div>
      <div className="clientes-table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.documento}</td>
                <td className="clientes-table-actions">
                  <button className="editar">Editar</button>
                  <button className="eliminar">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
