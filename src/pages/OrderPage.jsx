// src/pages/OrderPage.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        setError("No se pudieron cargar los pedidos.");
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="page-title">Listado de Pedidos</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente (ID)</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPage;
