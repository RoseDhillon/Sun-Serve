import api from "./api"

const userService = {
  // Get all users (admin only)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(
      `/users${queryString ? "?" + queryString : ""}`,
    )
    return response.data
  },

  // Get single user
  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Update user
  update: async (id, updateData) => {
    const response = await api.put(`/users/${id}`, updateData)
    return response.data
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // Get users by role
  getByRole: async (role) => {
    const response = await api.get(`/users/role/${role}`)
    return response.data
  },
}

export default userService
