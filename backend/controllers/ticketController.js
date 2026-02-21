const ServiceTicket = require("../models/ServiceTicket")

// Helper to allow only specific fields from body
const pick = (obj, fields) =>
  fields.reduce((acc, f) => {
    if (obj[f] !== undefined) acc[f] = obj[f]
    return acc
  }, {})

// @desc    Create new service ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res, next) => {
  try {
    const allowed = [
      "title",
      "description",
      "category",
      "priority",
      "relatedInstallation",
      "relatedMaintenance",
    ]

    const payload = pick(req.body, allowed)
    payload.createdBy = req.user.id

    const ticket = await ServiceTicket.create(payload)

    res.status(201).json({ success: true, message: "Service ticket created", data: ticket })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all service tickets (with pagination & filters)
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = Math.min(parseInt(req.query.limit, 10) || 25, 100)
    const skip = (page - 1) * limit

    // Base filter depending on role
    let filter = {}
    if (req.user.role === "customer") filter.createdBy = req.user.id
    else if (req.user.role === "technician") filter.assignedTo = req.user.id

    // Additional filters
    if (req.query.status) filter.status = req.query.status
    if (req.query.priority) filter.priority = req.query.priority
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo

    const [count, tickets] = await Promise.all([
      ServiceTicket.countDocuments(filter),
      ServiceTicket.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .populate("relatedInstallation", "address")
        .populate("relatedMaintenance", "description")
        .sort(req.query.sort || "-createdAt")
        .skip(skip)
        .limit(limit),
    ])

    res.status(200).json({ success: true, count, page, pageSize: tickets.length, data: tickets })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single service ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id)
      .populate("createdBy", "name email phone")
      .populate("assignedTo", "name email phone")
      .populate("relatedInstallation")
      .populate("relatedMaintenance")

    if (!ticket) return res.status(404).json({ success: false, error: "Service ticket not found" })

    res.status(200).json({ success: true, data: ticket })
  } catch (error) {
    next(error)
  }
}

// @desc    Close a service ticket
// @route   POST /api/tickets/:id/close
// @access  Private (Technician/Manager/Admin)
exports.closeTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ success: false, error: "Service ticket not found" })

    const resolution = req.body.resolution || req.body.note || undefined
    const closed = await ticket.close(resolution)
    res.status(200).json({ success: true, message: "Service ticket closed", data: closed })
  } catch (error) {
    next(error)
  }
}

// @desc    Update service ticket
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ success: false, error: "Service ticket not found" })

    const allowed = ["title", "description", "category", "priority", "status", "assignedTo", "resolution"]
    const payload = pick(req.body, allowed)

    // If ticket is being closed, set closedAt
    if (payload.status && payload.status.toLowerCase() === "closed" && ticket.status !== "closed") {
      payload.closedAt = Date.now()
    }

    const updated = await ServiceTicket.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, message: "Service ticket updated", data: updated })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete service ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ success: false, error: "Service ticket not found" })

    await ticket.deleteOne()
    res.status(200).json({ success: true, message: "Service ticket deleted" })
  } catch (error) {
    next(error)
  }
}
