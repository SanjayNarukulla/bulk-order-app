import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BuyerDashboard from "./components/BuyerDashboard/BuyerDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Ensure role & token are set when localStorage updates (optional safeguard)
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    const storedToken = localStorage.getItem("token") || "";
    if (storedRole !== role) setRole(storedRole);
    if (storedToken !== token) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
  };

  const handleLogin = (userRole, userToken) => {
    setRole(userRole);
    setToken(userToken);
  };

  return (
    <Router>
      {/* Show navbar only when logged in */}
      {token && (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
          <h1 className="text-lg font-bold">Bulk Order App</h1>
          <div className="space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 p-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to={role === "admin" ? "/admin" : "/buyer"} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/buyer"
          element={
            <ProtectedRoute allowedRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
