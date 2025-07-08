// src/pages/AdminUserPage.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

const AdminUserPage = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      setError("");
      const data = await api.getAdminUsers();
      setAdmins(data);
    } catch (err) {
      setError("No se pudieron cargar los administradores.");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.createAdminUser(form);
      setForm({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      setError("Error al crear el administrador.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro? Otros administradores podrían perder acceso."
      )
    ) {
      try {
        await api.deleteAdminUser(id);
        fetchAdmins();
      } catch (err) {
        setError("Error al eliminar el administrador.");
      }
    }
  };

  return (
    <div>
      <h2 className="page-title">Gestionar Administradores</h2>
      <div className="card">
        <h3>Nuevo Administrador</h3>
        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Crear
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h3>Listado de Administradores</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserPage;
