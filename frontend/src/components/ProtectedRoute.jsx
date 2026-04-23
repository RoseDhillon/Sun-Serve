import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth()

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Authenticated but wrong role - redirect to their dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboards = {
      admin: "/admin",
      manager: "/manager",
      technician: "/technician",
      customer: "/customer",
    }
    return <Navigate to={dashboards[user.role] || "/customer"} replace />
  }

  // Authenticated and authorized
  return children
}

export default ProtectedRoute
