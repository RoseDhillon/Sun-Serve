import api from "./api"

const installationService = {
  // Get all installations (role-based filtering on backend)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(
      `/installations${queryString ? "?" + queryString : ""}`,
    )
    return response.data
  },

  // Get single installation
  getById: async (id) => {
    const response = await api.get(`/installations/${id}`)
    return response.data
  },

  // Create new installation request
  create: async (installationData) => {
    const response = await api.post("/installations", installationData)
    return response.data
  },

  // Update installation
  update: async (id, updateData) => {
    const response = await api.put(`/installations/${id}`, updateData)
    return response.data
  },

  // Delete installation
  delete: async (id) => {
    const response = await api.delete(`/installations/${id}`)
    return response.data
  },

  // Get installations with pagination
  getPaginated: async (page = 1, limit = 10) => {
    const response = await api.get(`/installations?page=${page}&limit=${limit}`)
    return response.data
  },
}

export default installationService
