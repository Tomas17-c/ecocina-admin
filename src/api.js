// src/api.js
const API_BASE_URL = "http://localhost:3001"; // ⬅️ ¡CAMBIA ESTO POR LA URL DE TU BACKEND!

const request = async (endpoint, method, body = null) => {
  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    if (response.status === 204) return {};
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  getOrderById: (id) => request(`/orders/${id}`, "GET"),
  updateOrder: (id, data) => request(`/orders/${id}`, "PATCH", data),
  login: (credentials) => request("/admin-tokens", "POST", credentials),
  getProducts: () => request("/products", "GET"),
  createProduct: (product) => request("/products", "POST", product),
  updateProduct: (id, product) => request(`/products/${id}`, "PATCH", product),
  deleteProduct: (id) => request(`/products/${id}`, "DELETE"),
  getCategories: () => request("/categories", "GET"),
  createCategory: (category) => request("/categories", "POST", category),
  updateCategory: (id, category) =>
    request(`/categories/${id}`, "PATCH", category),
  deleteCategory: (id) => request(`/categories/${id}`, "DELETE"),
  getOrders: () => request("/orders", "GET"),
  getAdminUsers: () => request("/admin-users", "GET"),
  createAdminUser: (user) => request("/admin-users", "POST", user),
  deleteAdminUser: (id) => request(`/admin-users/${id}`, "DELETE"),
};
