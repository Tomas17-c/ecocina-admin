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
import DashboardPage from "./pages/DashboardPage";
// Component to protect routes that require login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" />;
};

// En src/App.jsx

//... tus otros imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* --- MIRA ESTE CAMBIO --- */}
          <Route index element={<DashboardPage />} /> 
          {/* ------------------------- */}
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
