const mongoose = require("mongoose")
const { TIME_SLOTS } = require("../utils/constants")

const ScheduleSchema = new mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please specify a technician"],
  },
  date: {
    type: Date,
    required: [true, "Please specify a date"],
  },
  timeSlot: {
    type: String,
    required: [true, "Please specify a time slot"],
    enum: Object.values(TIME_SLOTS),
  },
  jobType: {
    type: String,
    required: [true, "Please specify job type"],
    enum: ["installation", "maintenance", "inspection", "repair"],
  },
  relatedInstallation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Installation",
  },
  relatedMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MaintenanceRequest",
  },
  status: {
    type: String,
    enum: ["scheduled", "in_progress", "completed", "cancelled", "rescheduled"],
    default: "scheduled",
  },
  location: {
    street: {
      type: String,
      required: [true, "Please add street address"],
    },
    city: {
      type: String,
      required: [true, "Please add city"],
    },
    state: {
      type: String,
      required: [true, "Please add state"],
    },
    zipCode: {
      type: String,
      required: [true, "Please add zip code"],
    },
  },
  estimatedDuration: {
    type: Number, // in hours
    required: [true, "Please specify estimated duration"],
  },
  actualStartTime: {
    type: Date,
  },
  actualEndTime: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: [500, "Notes cannot exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Prevent double booking - ensure technician is not scheduled twice for same time
ScheduleSchema.index({ technician: 1, date: 1, timeSlot: 1 }, { unique: true })

// Additional indexes for queries
ScheduleSchema.index({ technician: 1, date: 1 })
ScheduleSchema.index({ status: 1, date: 1 })

// Update the updatedAt timestamp on save
ScheduleSchema.pre("save", function () {
  this.updatedAt = Date.now()
})

module.exports = mongoose.model("Schedule", ScheduleSchema)
