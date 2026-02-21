const Installation = require("../models/Installation")

// @desc    Create new installation request
// @route   POST /api/installations
// @access  Private (Customer)
exports.createInstallation = async (req, res, next) => {
  try {
    // Add customer from authenticated user
    req.body.customer = req.user.id

    const installation = await Installation.create(req.body)

    res.status(201).json({
      success: true,
      message: "Installation request created successfully",
      data: installation,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all installations
// @route   GET /api/installations
// @access  Private
exports.getInstallations = async (req, res, next) => {
  try {
    let query

    // If user is customer, only show their installations
    if (req.user.role === "customer") {
      query = Installation.find({ customer: req.user.id })
    }
    // If user is technician, show assigned installations
    else if (req.user.role === "technician") {
      query = Installation.find({ assignedTechnician: req.user.id })
    }
    // Admin and Manager see all
    else {
      query = Installation.find()
    }

    const installations = await query
      .populate("customer", "name email phone")
      .populate("assignedTechnician", "name email")
      .populate("approvedBy", "name")

    res.status(200).json({
      success: true,
      count: installations.length,
      data: installations,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single installation
// @route   GET /api/installations/:id
// @access  Private
exports.getInstallation = async (req, res, next) => {
  try {
    const installation = await Installation.findById(req.params.id)
      .populate("customer", "name email phone address")
      .populate("assignedTechnician", "name email phone")
      .populate("approvedBy", "name email")

    if (!installation) {
      return res.status(404).json({
        success: false,
        error: "Installation not found",
      })
    }

    res.status(200).json({
      success: true,
      data: installation,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update installation
// @route   PUT /api/installations/:id
// @access  Private (Manager/Admin)
exports.updateInstallation = async (req, res, next) => {
  try {
    let installation = await Installation.findById(req.params.id)

    if (!installation) {
      return res.status(404).json({
        success: false,
        error: "Installation not found",
      })
    }

    installation = await Installation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      success: true,
      message: "Installation updated successfully",
      data: installation,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete installation
// @route   DELETE /api/installations/:id
// @access  Private (Admin only)
exports.deleteInstallation = async (req, res, next) => {
  try {
    const installation = await Installation.findById(req.params.id)

    if (!installation) {
      return res.status(404).json({
        success: false,
        error: "Installation not found",
      })
    }

    await installation.deleteOne()

    res.status(200).json({
      success: true,
      message: "Installation deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
