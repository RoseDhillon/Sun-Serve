import api from "./api"

const ticketService = {
  // Get all tickets (role-based filtering)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(
      `/tickets${queryString ? "?" + queryString : ""}`,
    )
    return response.data
  },

  // Get single ticket
  getById: async (id) => {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  // Create new ticket
  create: async (ticketData) => {
    const response = await api.post("/tickets", ticketData)
    return response.data
  },

  // Update ticket
  update: async (id, updateData) => {
    const response = await api.put(`/tickets/${id}`, updateData)
    return response.data
  },

  // Delete ticket
  delete: async (id) => {
    const response = await api.delete(`/tickets/${id}`)
    return response.data
  },
}

export default ticketService
