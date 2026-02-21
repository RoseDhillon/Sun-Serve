const Equipment = require("../models/Equipment")

const pick = (obj, fields) =>
  fields.reduce((acc, f) => {
    if (obj[f] !== undefined) acc[f] = obj[f]
    return acc
  }, {})

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private (Admin/Manager)
exports.createEquipment = async (req, res, next) => {
  try {
    const allowed = [
      "name",
      "category",
      "manufacturer",
      "model",
      "specifications",
      "quantity",
      "minimumStock",
      "unitPrice",
      "supplier",
      "location",
      "notes",
    ]

    const payload = pick(req.body, allowed)
    if (payload.quantity && payload.quantity > 0) payload.lastRestocked = Date.now()

    const equipment = await Equipment.create(payload)

    res.status(201).json({ success: true, message: "Equipment added", data: equipment })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
exports.getEquipment = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200)
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true"

    const [count, items] = await Promise.all([
      Equipment.countDocuments(filter),
      Equipment.find(filter).sort(req.query.sort || "name").skip(skip).limit(limit),
    ])

    res.status(200).json({ success: true, count, page, pageSize: items.length, data: items })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single equipment item
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipmentItem = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) return res.status(404).json({ success: false, error: "Equipment not found" })
    res.status(200).json({ success: true, data: equipment })
  } catch (error) {
    next(error)
  }
}

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Admin/Manager)
exports.updateEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) return res.status(404).json({ success: false, error: "Equipment not found" })

    const allowed = [
      "name",
      "category",
      "manufacturer",
      "model",
      "specifications",
      "quantity",
      "minimumStock",
      "unitPrice",
      "supplier",
      "location",
      "notes",
      "isActive",
    ]

    const payload = pick(req.body, allowed)
    // If restocking, update lastRestocked date
    if (payload.quantity !== undefined && payload.quantity > equipment.quantity) payload.lastRestocked = Date.now()

    const updated = await Equipment.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, message: "Equipment updated", data: updated })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Admin only)
exports.deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) return res.status(404).json({ success: false, error: "Equipment not found" })

    await equipment.deleteOne()
    res.status(200).json({ success: true, message: "Equipment deleted" })
  } catch (error) {
    next(error)
  }
}

// @desc    Get low stock equipment
// @route   GET /api/equipment/lowstock
// @access  Private (Admin/Manager)
exports.getLowStockEquipment = async (req, res, next) => {
  try {
    const items = await Equipment.find({ $expr: { $lte: ["$quantity", "$minimumStock"] }, isActive: true })
    res.status(200).json({ success: true, count: items.length, data: items })
  } catch (error) {
    next(error)
  }
}
