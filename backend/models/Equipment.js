const mongoose = require("mongoose")
const { EQUIPMENT_CATEGORY } = require("../utils/constants")

const EquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add equipment name"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Please specify equipment category"],
      enum: Object.values(EQUIPMENT_CATEGORY),
      index: true,
    },
    manufacturer: {
      type: String,
      required: [true, "Please add manufacturer name"],
      maxlength: [100, "Manufacturer name cannot exceed 100 characters"],
    },
    model: {
      type: String,
      required: [true, "Please add model number"],
      maxlength: [100, "Model cannot exceed 100 characters"],
    },
    specifications: {
      power: {
        type: Number,
      },
      voltage: {
        type: Number,
      },
      dimensions: {
        type: String,
      },
      weight: {
        type: Number,
      },
      warranty: {
        type: Number,
      },
      efficiency: {
        type: Number,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Please specify quantity"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    minimumStock: {
      type: Number,
      default: 10,
      min: [0, "Minimum stock cannot be negative"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Please add unit price"],
      min: [0, "Price cannot be negative"],
    },
    supplier: {
      name: {
        type: String,
        required: [true, "Please add supplier name"],
      },
      contact: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    location: {
      type: String,
      default: "Main Warehouse",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastRestocked: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Create indexes
EquipmentSchema.index({ category: 1, isActive: 1 })
EquipmentSchema.index({ name: 1 })

// Virtual for low stock alert
EquipmentSchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.minimumStock
})

module.exports = mongoose.model("Equipment", EquipmentSchema)
