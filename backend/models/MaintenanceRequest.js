const mongoose = require("mongoose")
const { MAINTENANCE_STATUS, TICKET_PRIORITY } = require("../utils/constants")

const MaintenanceRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please specify a customer"],
  },
  installation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Installation",
    required: [true, "Please specify related installation"],
  },
  requestType: {
    type: String,
    required: [true, "Please specify maintenance type"],
    enum: ["routine", "repair", "inspection", "cleaning", "upgrade"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  priority: {
    type: String,
    enum: Object.values(TICKET_PRIORITY),
    default: TICKET_PRIORITY.MEDIUM,
  },
  status: {
    type: String,
    enum: Object.values(MAINTENANCE_STATUS),
    default: MAINTENANCE_STATUS.REQUESTED,
  },
  requestedDate: {
    type: Date,
    default: Date.now,
  },
  scheduledDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  estimatedDuration: {
    type: Number, // in hours
    min: [0.5, "Duration must be at least 0.5 hours"],
  },
  actualDuration: {
    type: Number, // in hours
  },
  cost: {
    type: Number,
    min: [0, "Cost cannot be negative"],
    default: 0,
  },
  notes: {
    type: String,
    maxlength: [1000, "Notes cannot exceed 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes
MaintenanceRequestSchema.index({ customer: 1, status: 1 })
MaintenanceRequestSchema.index({ installation: 1 })
MaintenanceRequestSchema.index({ assignedTechnician: 1, status: 1 })

module.exports = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema)
