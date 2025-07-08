// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setError("");
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      setError("No se pudieron cargar las categorías.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { name });
      } else {
        await api.createCategory({ name });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      setError("Error al guardar la categoría.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
    ) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError("Error al eliminar la categoría.");
      }
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setName("");
  };

  return (
    <div>
      <h2 className="page-title">Gestionar Categorías</h2>
      <div className="card">
        <h3>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</h3>
        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingCategory ? "Actualizar" : "Crear"}
          </button>
          {editingCategory && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h3>Listado de Categorías</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button onClick={() => handleEdit(cat)} className="btn-edit">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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

export default CategoryPage;
