// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import "./DashboardPage.css"; // Crearemos este archivo para los estilos

const DashboardPage = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Hacemos todas las llamadas a la API en paralelo para más eficiencia
        const [ordersData, productsData, clientsData] = await Promise.all([
          api.getOrders(),
          api.getProducts(),
          api.getAdminUsers(), // Usamos admin users como ejemplo, idealmente sería api.getClients()
        ]);

        setStats({
          orders: ordersData.length,
          products: productsData.length,
          clients: clientsData.length,
        });
      } catch (err) {
        setError("No se pudieron cargar los datos del dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2 className="page-title">Dashboard de ecocina</h2>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total de Pedidos</h3>
          <p>{stats.orders}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Productos</h3>
          <p>{stats.products}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Usuarios</h3>
          <p>{stats.clients}</p>
        </div>
      </div>
      {/* Aquí podríamos agregar los gráficos en el futuro */}
    </div>
  );
};

export default DashboardPage;
