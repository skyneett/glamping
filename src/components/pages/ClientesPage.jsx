// Página de Clientes: muestra la lista de clientes desde el JSON y permite agregar nuevos
import React, { useEffect, useState } from 'react';
// Importa el layout principal para la estructura de la página
import MainLayout from '../templates/MainLayout';

// Exporta el componente ClientesPage para ser usado en las rutas de App.jsx
export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', documento: '' });
  const [showModal, setShowModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const [errores, setErrores] = useState({});

  // Cargar clientes desde la API
  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  const validar = (datos) => {
    const errores = {};
    if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio';
    if (!datos.email.trim()) errores.email = 'El email es obligatorio';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.email)) errores.email = 'Email inválido';
    if (!datos.telefono.trim()) errores.telefono = 'El teléfono es obligatorio';
    if (!datos.documento.trim()) errores.documento = 'El documento es obligatorio';
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
      setErrores(nuevosErrores);
      mostrarAlerta(
        <span>Por favor corrija los siguientes errores:<ul>{Object.values(nuevosErrores).map((err, i) => <li key={i}>{err}</li>)}</ul></span>,
        'danger'
      );
      return;
    }
    setErrores({});
    if (editandoId) {
      // Actualizar cliente existente (solo en memoria, podrías agregar un endpoint PUT en el backend si lo deseas)
      const actualizados = clientes.map(c =>
        c.id === editandoId ? { ...c, ...form } : c
      );
      setClientes(actualizados);
      mostrarAlerta('Cliente actualizado con éxito', 'success');
      resetearFormulario();
    } else {
      // Crear nuevo cliente (POST a la API)
      const nuevoCliente = {
        id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
        ...form
      };
      fetch('http://localhost:3001/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      })
        .then(res => res.json())
        .then(data => {
          setClientes([...clientes, data]);
          mostrarAlerta('Cliente creado con éxito', 'success');
          resetearFormulario();
        });
    }
  };


  const handleEditar = (cliente) => {
    setForm({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono, documento: cliente.documento });
    setEditandoId(cliente.id);
  };

  const resetearFormulario = () => {
    setForm({ nombre: '', email: '', telefono: '', documento: '' });
    setEditandoId(null);
    setErrores({});
  };

  const handleEliminar = (cliente) => {
    setClienteAEliminar(cliente);
    setShowModal(true);
  };

  const confirmarEliminar = () => {
    // Eliminar cliente (solo en memoria, podrías agregar un endpoint DELETE en el backend si lo deseas)
    setClientes(clientes.filter(c => c.id !== clienteAEliminar.id));
    setShowModal(false);
    setClienteAEliminar(null);
    mostrarAlerta('Cliente eliminado con éxito', 'success');
    if (editandoId === clienteAEliminar?.id) resetearFormulario();
  };

  const cancelarEliminar = () => {
    setShowModal(false);
    setClienteAEliminar(null);
  };

  return (
    <MainLayout>
      <div className="container">
        <h2>Gestión de Clientes</h2>
        <div id="alerts-container">
          {alerta.mensaje && (
            <div className={`alert alert-${alerta.tipo}`}>{alerta.mensaje}</div>
          )}
        </div>
        <div className="form-container">
          <h3>Nuevo Cliente</h3>
          <form onSubmit={handleSubmit} id="form-cliente">
            {/* <input type="hidden" id="cliente-id" /> */}
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input name="nombre" id="nombre" type="text" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input name="email" id="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input name="telefono" id="telefono" type="text" value={form.telefono} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="documento">Documento</label>
              <input name="documento" id="documento" type="text" value={form.documento} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="success">{editandoId ? 'Actualizar' : 'Guardar'}</button>
              {editandoId && (
                <button type="button" id="btn-cancelar" className="btn-cancelar" style={{marginLeft:8}} onClick={resetearFormulario}>Cancelar</button>
              )}
            </div>
          </form>
        </div>
        <h3>Lista de Clientes</h3>
        <div className="table-container">
          <table id="tabla-clientes">
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
                    <button className="editar" onClick={() => handleEditar(cliente)}>Editar</button>
                    <button className="eliminar" onClick={() => handleEliminar(cliente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de confirmación */}
        {showModal && (
          <div className="modal" style={{display:'flex'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>Confirmar eliminación</h2>
                <button className="close-modal" onClick={cancelarEliminar}>&times;</button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.</p>
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
