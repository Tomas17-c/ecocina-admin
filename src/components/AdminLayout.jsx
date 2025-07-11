// src/components/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h1 className="sidebar-title">ecocina</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/products">Productos</NavLink>
            </li>
            <li>
              <NavLink to="/categories">Categorías</NavLink>
            </li>
            <li>
              <NavLink to="/orders">Pedidos</NavLink>
            </li>
            <li>
              <NavLink to="/admins">Administradores</NavLink>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="btn-logout btn-delete">
          Cerrar Sesión
        </button>
      </aside>
      <main className="main-content">
        <Outlet /> {/* Renders the current page (ProductPage, etc.) */}
      </main>
    </div>
  );
};

export default AdminLayout;
