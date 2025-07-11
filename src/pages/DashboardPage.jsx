// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import "./DashboardPage.css";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // <-- Importante para el gráfico de dona
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registramos los componentes que usarán los gráficos
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // <-- Registramos el nuevo elemento
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0, clients: 0 });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  // --- AÑADIDO: Estado para el nuevo gráfico ---
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: [],
    datasets: [],
  });
  // -----------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersData, productsData, clientsData] = await Promise.all([
          api.getOrders(),
          api.getProducts(),
          api.getAdminUsers(),
        ]);

        setStats({
          orders: ordersData.length,
          products: productsData.length,
          clients: clientsData.length,
        });

        // Lógica para el gráfico de barras (pedidos por día)
        const ordersByDay = {};
        ordersData.forEach((order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          ordersByDay[date] = (ordersByDay[date] || 0) + 1;
        });
        setBarChartData({
          labels: Object.keys(ordersByDay),
          datasets: [
            {
              label: "Pedidos por Día",
              data: Object.values(ordersByDay),
              backgroundColor: "rgba(42, 157, 143, 0.6)",
            },
          ],
        });

        // --- AÑADIDO: Lógica para el gráfico de dona (pedidos por estado) ---
        const ordersByStatus = {};
        ordersData.forEach((order) => {
          const status = order.status || "No definido";
          ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
        });
        setDoughnutChartData({
          labels: Object.keys(ordersByStatus),
          datasets: [
            {
              label: "Estado de Pedidos",
              data: Object.values(ordersByStatus),
              backgroundColor: [
                "#2a9d8f",
                "#e9c46a",
                "#f4a261",
                "#e76f51",
                "#264653",
              ],
              borderColor: ["#ffffff"],
              borderWidth: 2,
            },
          ],
        });
        // -----------------------------------------------------------------
      } catch (err) {
        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Actividad de Pedidos Recientes" },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Distribución de Estado de Pedidos" },
    },
  };

  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

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

      {/* --- SECCIÓN DE GRÁFICOS --- */}
      <div className="charts-container">
        <div className="card chart-wrapper">
          <Bar options={barChartOptions} data={barChartData} />
        </div>
        <div className="card chart-wrapper">
          <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
        </div>
      </div>
      {/* ------------------------- */}
    </div>
  );
};

export default DashboardPage;
