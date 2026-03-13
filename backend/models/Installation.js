const mongoose = require("mongoose")
const { INSTALLATION_STATUS } = require("../utils/constants")

const InstallationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please specify a customer"],
  },
  address: {
    street: {
      type: String,
      required: [true, "Please add installation street address"],
    },
    city: {
      type: String,
      required: [true, "Please add installation city"],
    },
    state: {
      type: String,
      required: [true, "Please add installation state"],
    },
    zipCode: {
      type: String,
      required: [true, "Please add installation zip code"],
    },
  },
  systemSize: {
    type: Number,
    required: [true, "Please specify system size in kW"],
    min: [1, "System size must be at least 1 kW"],
  },
  panelType: {
    type: String,
    required: [true, "Please specify panel type"],
    enum: ["monocrystalline", "polycrystalline", "thin-film"],
  },
  numberOfPanels: {
    type: Number,
    required: [true, "Please specify number of panels"],
    min: [1, "Must have at least 1 panel"],
  },
  estimatedCost: {
    type: Number,
    required: [true, "Please provide estimated cost"],
    min: [0, "Cost cannot be negative"],
  },
  status: {
    type: String,
    enum: Object.values(INSTALLATION_STATUS),
    default: INSTALLATION_STATUS.REQUESTED,
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
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

// Create index for better query performance
InstallationSchema.index({ customer: 1, status: 1 })
InstallationSchema.index({ assignedTechnician: 1, status: 1 })

module.exports = mongoose.model("Installation", InstallationSchema)
