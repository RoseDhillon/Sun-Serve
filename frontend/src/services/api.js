import axios from "axios"

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 - Unauthorized (token expired or invalid)
      if (error.response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }

      // Handle 403 - Forbidden (insufficient permissions)
      if (error.response.status === 403) {
        console.error("Access forbidden - insufficient permissions")
      }

      // Handle 429 - Too Many Requests (rate limit)
      if (error.response.status === 429) {
        console.error("Too many requests - please wait and try again")
      }
    }
    return Promise.reject(error)
  },
)

export default api
