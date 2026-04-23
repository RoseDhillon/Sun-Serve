import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { FaSun, FaEnvelope, FaLock } from "react-icons/fa"
import { toast } from "react-toastify"
import "./Auth.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const data = await login(email, password)
      toast.success(`Welcome back, ${data.user.name}!`)

      // Redirect based on role
      const dashboards = {
        admin: "/admin",
        manager: "/manager",
        technician: "/technician",
        customer: "/customer",
      }
      navigate(dashboards[data.user.role] || "/customer")
    } catch (error) {
      const message =
        error.response?.data?.error || "Login failed. Please try again."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Quick login buttons for testing
  const quickLogin = async (testEmail, testPassword) => {
    setEmail(testEmail)
    setPassword(testPassword)
    // Will auto-submit
    setTimeout(() => {
      document
        .getElementById("login-form")
        .dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
    }, 100)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaSun className="auth-icon" />
          <h1>SunServe</h1>
          <p>Solar Installation Management</p>
        </div>

        <h2>Login to Your Account</h2>

        <form id="login-form" onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Quick Login (Testing)</span>
        </div>

        <div className="quick-login-buttons">
          <button
            onClick={() => quickLogin("admin@sunserve.com", "admin123")}
            className="btn btn-test"
          >
            Admin
          </button>
          <button
            onClick={() => quickLogin("manager@sunserve.com", "manager123")}
            className="btn btn-test"
          >
            Manager
          </button>
          <button
            onClick={() => quickLogin("tech1@sunserve.com", "tech123")}
            className="btn btn-test"
          >
            Technician
          </button>
          <button
            onClick={() => quickLogin("sarah@example.com", "customer123")}
            className="btn btn-test"
          >
            Customer
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
