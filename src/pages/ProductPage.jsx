// src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setError("");
      const productsData = await api.getProducts();
      const categoriesData = await api.getCategories();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("No se pudieron cargar los datos.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      categoryId: parseInt(form.categoryId, 10),
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError("Error al guardar el producto.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    });
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await api.deleteProduct(id);
        fetchData();
      } catch (err) {
        setError("Error al eliminar el producto.");
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });
  };

  return (
    <div>
      <h2 className="page-title">Gestionar Productos</h2>
      <div className="card">
        <h3>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h3>

        {/* --- INICIO DE LA SECCIÓN MODIFICADA --- */}
        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Ej: Camisa de Lino"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Información detallada del producto"
              value={form.description}
              onChange={handleChange}
              required
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Ej: 29.99"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock Disponible</label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Ej: 50"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryId">Categoría</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            {" "}
            {/* Contenedor para los botones */}
            <button type="submit" className="btn-primary">
              {editingProduct ? "Actualizar Producto" : "Crear Producto"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
                style={{ marginLeft: "1rem" }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="card">
        <h3>Listado de Productos</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>${prod.price}</td>
                <td>{prod.stock}</td>
                <td>
                  <button onClick={() => handleEdit(prod)} className="btn-edit">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
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

export default ProductPage;
