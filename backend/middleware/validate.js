// Validate request body fields
exports.validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = []

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field)
      }
    })

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      })
    }

    next()
  }
}

// Validate email format
exports.validateEmail = (req, res, next) => {
  const { email } = req.body

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      })
    }
  }

  next()
}

// Validate phone number format (basic validation)
exports.validatePhone = (req, res, next) => {
  const { phone } = req.body

  if (phone) {
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid 10-digit phone number",
      })
    }
  }

  next()
}
