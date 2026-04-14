const mongoose = require("mongoose")
const {
  INSTALLATION_STATUS,
  MAINTENANCE_STATUS,
  TICKET_STATUS,
} = require("./constants")

// Validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

// Validate date is not in the past
const isDateInFuture = (date) => {
  return new Date(date) > new Date()
}

// Validate date range
const isValidDateRange = (startDate, endDate) => {
  return new Date(startDate) < new Date(endDate)
}

// Validate installation status transitions
const validateInstallationStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    requested: ["approved", "cancelled"],
    approved: ["scheduled", "cancelled"],
    scheduled: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}

// Validate maintenance status transitions
const validateMaintenanceStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    requested: ["scheduled", "cancelled"],
    scheduled: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}

// Validate ticket status transitions
const validateTicketStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    open: ["assigned", "closed"],
    assigned: ["in_progress", "closed"],
    in_progress: ["resolved", "closed"],
    resolved: ["closed"],
    closed: [],
  }

  return validTransitions[currentStatus]?.includes(newStatus) || false
}

// Validate phone number format
const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ""))
}

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

// Validate price/cost (must be positive)
const validatePrice = (price) => {
  return typeof price === "number" && price >= 0
}

// Validate system size (for solar installations)
const validateSystemSize = (size) => {
  return typeof size === "number" && size >= 1 && size <= 100 // 1kW to 100kW
}

// Validate number of panels
const validatePanelCount = (count) => {
  return Number.isInteger(count) && count >= 1 && count <= 1000
}

// Validate zip code (US/Canada format)
const validateZipCode = (zipCode) => {
  const usZipRegex = /^\d{5}(-\d{4})?$/
  const canadaZipRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i
  return usZipRegex.test(zipCode) || canadaZipRegex.test(zipCode)
}

// Validate time slot
const validateTimeSlot = (timeSlot) => {
  const validSlots = ["08:00-12:00", "12:00-16:00", "16:00-20:00"]
  return validSlots.includes(timeSlot)
}

// Validate user role assignment (only admins can create admins)
const canAssignRole = (assignerRole, targetRole) => {
  if (targetRole === "admin") {
    return assignerRole === "admin"
  }
  if (targetRole === "manager") {
    return ["admin", "manager"].includes(assignerRole)
  }
  return true // Anyone can create customer/technician
}

// Validate equipment quantity update
const validateQuantityUpdate = (currentQuantity, adjustment) => {
  const newQuantity = currentQuantity + adjustment
  return newQuantity >= 0 // Can't have negative inventory
}

// Validate maintenance request for installation ownership
const validateMaintenanceOwnership = async (
  customerId,
  installationId,
  Installation,
) => {
  const installation = await Installation.findById(installationId)
  if (!installation) {
    return { valid: false, error: "Installation not found" }
  }
  if (installation.customer.toString() !== customerId.toString()) {
    return {
      valid: false,
      error: "You can only request maintenance for your own installations",
    }
  }
  return { valid: true }
}

module.exports = {
  isValidObjectId,
  isDateInFuture,
  isValidDateRange,
  validateInstallationStatusTransition,
  validateMaintenanceStatusTransition,
  validateTicketStatusTransition,
  validatePhone,
  validateEmail,
  validatePrice,
  validateSystemSize,
  validatePanelCount,
  validateZipCode,
  validateTimeSlot,
  canAssignRole,
  validateQuantityUpdate,
  validateMaintenanceOwnership,
}
