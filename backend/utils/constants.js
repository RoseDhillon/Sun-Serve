// User Roles
const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  TECHNICIAN: "technician",
  CUSTOMER: "customer",
}

// Installation Status
const INSTALLATION_STATUS = {
  REQUESTED: "requested",
  APPROVED: "approved",
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

// Maintenance Status
const MAINTENANCE_STATUS = {
  REQUESTED: "requested",
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

// Ticket Priority
const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
}

// Ticket Status
const TICKET_STATUS = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
}

// Equipment Categories
const EQUIPMENT_CATEGORY = {
  SOLAR_PANEL: "solar_panel",
  INVERTER: "inverter",
  BATTERY: "battery",
  MOUNTING: "mounting",
  WIRING: "wiring",
  MONITORING: "monitoring",
  TOOLS: "tools",
}

// Schedule Time Slots
const TIME_SLOTS = {
  MORNING: "08:00-12:00",
  AFTERNOON: "12:00-16:00",
  EVENING: "16:00-20:00",
}

module.exports = {
  USER_ROLES,
  INSTALLATION_STATUS,
  MAINTENANCE_STATUS,
  TICKET_PRIORITY,
  TICKET_STATUS,
  EQUIPMENT_CATEGORY,
  TIME_SLOTS,
}
