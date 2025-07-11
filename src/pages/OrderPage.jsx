// src/pages/OrderPage.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";
import "./OrderPage.css"; // Estilos para la modal

const OrderDetailsModal = ({ order, onClose, onStatusChange }) => {
  if (!order) return null;

  const handleStatusChange = (e) => {
    onStatusChange(order.id, e.target.value);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">
          &times;
        </button>
        <h2>Detalles del Pedido #{order.id}</h2>
        <p>
          <strong>Cliente ID:</strong> {order.userId}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="form-group">
          <label>
            <strong>Estado del Pedido:</strong>
          </label>
          <select value={order.status} onChange={handleStatusChange}>
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Enviado">Enviado</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <h4>Productos:</h4>
        <ul className="product-list">
          {order.products &&
            order.products.map((product) => (
              <li key={product.id}>
                {product.name} -{" "}
                <span>Cantidad: {product.OrderProduct.quantity}</span> -{" "}
                <span>Precio: ${product.price}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError("No se pudieron cargar los pedidos.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShowDetails = async (id) => {
    try {
      const orderDetails = await api.getOrderById(id);
      setSelectedOrder(orderDetails);
    } catch (err) {
      setError("No se pudieron cargar los detalles del pedido.");
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      // Actualizamos el estado en la lista local para no recargar todo
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    } catch (err) {
      setError("Error al actualizar el estado.");
    }
  };

  return (
    <div>
      <h2 className="page-title">Listado de Pedidos</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleShowDetails(order.id)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default OrderPage;
