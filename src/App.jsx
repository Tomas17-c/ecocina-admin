// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import Layout and Pages
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import AdminUserPage from "./pages/AdminUserPage";

// Component to protect routes that require login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*" // Any other route will be handled by the admin panel
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Routes nested inside the panel */}
          <Route
            index
            element={<h2 className="page-title">Bienvenido a ecocina</h2>}
          />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="admins" element={<AdminUserPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
