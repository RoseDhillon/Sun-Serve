import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// Dashboards
import CustomerDashboard from "./pages/customer/Dashboard"
import TechnicianDashboard from "./pages/technician/Dashboard"
import ManagerDashboard from "./pages/manager/Dashboard"
import AdminDashboard from "./pages/admin/Dashboard"

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes - Customer */}
              <Route
                path="/customer/*"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes - Technician */}
              <Route
                path="/technician/*"
                element={
                  <ProtectedRoute allowedRoles={["technician"]}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes - Manager */}
              <Route
                path="/manager/*"
                element={
                  <ProtectedRoute allowedRoles={["manager"]}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes - Admin */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
