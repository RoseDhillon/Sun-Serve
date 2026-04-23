import api from "./api"

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },

  // Get user from localStorage
  getUser: () => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token")
  },
}

export default authService
