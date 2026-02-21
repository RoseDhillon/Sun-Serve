const mongoose = require("mongoose")
const { TICKET_STATUS, TICKET_PRIORITY } = require("../utils/constants")

const ServiceTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please add a ticket title"],
      maxlength: [200, "Title cannot exceed 200 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: ["technical", "billing", "general", "emergency", "warranty"],
    },
    priority: {
      type: String,
      enum: Object.values(TICKET_PRIORITY),
      default: TICKET_PRIORITY.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.OPEN,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify ticket creator"],
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedInstallation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installation",
    },
    relatedMaintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceRequest",
    },
    resolution: {
      type: String,
      maxlength: [2000, "Resolution cannot exceed 2000 characters"],
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Safer ticketNumber generation using timestamp + random suffix
ServiceTicketSchema.pre("save", function () {
  if (!this.ticketNumber) {
    const ts = Date.now().toString(36)
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
    this.ticketNumber = `TICKET-${ts}-${rand}`
  }
  // Ensure updatedAt handled by timestamps
})

// Instance helper to close ticket
ServiceTicketSchema.methods.close = function (resolutionText) {
  this.status = TICKET_STATUS.CLOSED
  if (resolutionText) this.resolution = resolutionText
  this.closedAt = Date.now()
  return this.save()
}

// Create indexes
ServiceTicketSchema.index({ createdBy: 1, status: 1 })
ServiceTicketSchema.index({ assignedTo: 1, status: 1 })

module.exports = mongoose.model("ServiceTicket", ServiceTicketSchema)
