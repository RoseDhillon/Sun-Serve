const mongoSanitize = require("express-mongo-sanitize")

// Sanitize user input to prevent MongoDB injection
const sanitizeInput = mongoSanitize({
  replaceWith: "_", // Replace prohibited characters with underscore
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized input detected: ${key}`)
  },
})

// Additional XSS protection for specific fields
const sanitizeStringFields = (req, res, next) => {
  // Define fields that need extra sanitization
  const dangerousChars = /<script|<iframe|javascript:|onerror=|onload=/gi

  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        // Check for dangerous patterns
        if (dangerousChars.test(obj[key])) {
          return res.status(400).json({
            success: false,
            error: "Invalid input detected. Please remove special characters.",
          })
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key])
      }
    }
  }

  if (req.body) {
    sanitizeObject(req.body)
  }

  next()
}

module.exports = {
  sanitizeInput,
  sanitizeStringFields,
}
