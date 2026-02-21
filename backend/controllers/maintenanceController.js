const MaintenanceRequest = require("../models/MaintenanceRequest")

// @desc    Create new maintenance request
// @route   POST /api/maintenance
// @access  Private (Customer)
exports.createMaintenanceRequest = async (req, res, next) => {
  try {
    // Add customer from authenticated user
    req.body.customer = req.user.id

    const maintenanceRequest = await MaintenanceRequest.create(req.body)

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      data: maintenanceRequest,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenanceRequests = async (req, res, next) => {
  try {
    let query

    // If user is customer, only show their requests
    if (req.user.role === "customer") {
      query = MaintenanceRequest.find({ customer: req.user.id })
    }
    // If user is technician, show assigned requests
    else if (req.user.role === "technician") {
      query = MaintenanceRequest.find({ assignedTechnician: req.user.id })
    }
    // Admin and Manager see all
    else {
      query = MaintenanceRequest.find()
    }

    const requests = await query
      .populate("customer", "name email phone")
      .populate("installation", "address systemSize")
      .populate("assignedTechnician", "name email")

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenanceRequest = async (req, res, next) => {
  try {
    const maintenanceRequest = await MaintenanceRequest.findById(req.params.id)
      .populate("customer", "name email phone address")
      .populate("installation", "address systemSize panelType")
      .populate("assignedTechnician", "name email phone")

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        error: "Maintenance request not found",
      })
    }

    res.status(200).json({
      success: true,
      data: maintenanceRequest,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private (Manager/Admin/Technician)
exports.updateMaintenanceRequest = async (req, res, next) => {
  try {
    let maintenanceRequest = await MaintenanceRequest.findById(req.params.id)

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        error: "Maintenance request not found",
      })
    }

    maintenanceRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      success: true,
      message: "Maintenance request updated successfully",
      data: maintenanceRequest,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete maintenance request
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin only)
exports.deleteMaintenanceRequest = async (req, res, next) => {
  try {
    const maintenanceRequest = await MaintenanceRequest.findById(req.params.id)

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        error: "Maintenance request not found",
      })
    }

    await maintenanceRequest.deleteOne()

    res.status(200).json({
      success: true,
      message: "Maintenance request deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
