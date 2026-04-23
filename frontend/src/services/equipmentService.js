import api from "./api"

const equipmentService = {
  // Get all equipment
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(
      `/equipment${queryString ? "?" + queryString : ""}`,
    )
    return response.data
  },

  // Get single equipment item
  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`)
    return response.data
  },

  // Create new equipment
  create: async (equipmentData) => {
    const response = await api.post("/equipment", equipmentData)
    return response.data
  },

  // Update equipment
  update: async (id, updateData) => {
    const response = await api.put(`/equipment/${id}`, updateData)
    return response.data
  },

  // Delete equipment
  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`)
    return response.data
  },

  // Get low stock equipment
  getLowStock: async () => {
    const response = await api.get("/equipment/lowstock")
    return response.data
  },
}

export default equipmentService
