import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaSun, FaUser, FaSignOutAlt } from "react-icons/fa"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getDashboardLink = () => {
    if (!user) return "/"
    const dashboards = {
      admin: "/admin",
      manager: "/manager",
      technician: "/technician",
      customer: "/customer",
    }
    return dashboards[user.role] || "/"
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getDashboardLink()} className="navbar-logo">
          <FaSun className="navbar-icon" />
          <span>SunServe</span>
        </Link>

        {isAuthenticated && (
          <div className="navbar-menu">
            <div className="navbar-user">
              <FaUser className="user-icon" />
              <span className="user-name">{user?.name}</span>
              <span className="user-role">({user?.role})</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
