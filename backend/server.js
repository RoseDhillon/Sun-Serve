const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const helmet = require("helmet")
const connectDB = require("./config/database")
const errorHandler = require("./middleware/errorHandler")
const { apiLimiter, authLimiter } = require("./config/rateLimit")
const { sanitizeInput, sanitizeStringFields } = require("./middleware/sanitize")
const { devLogger, prodLogger, logError } = require("./middleware/logger")

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Connect to MongoDB
connectDB()

// ====================================
// PHASE II: SECURITY MIDDLEWARE
// ====================================

// Helmet - Set security HTTP headers
app.use(helmet())

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Sanitize data - prevent NoSQL injection
app.use(sanitizeInput)
app.use(sanitizeStringFields)

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(devLogger)
} else {
  app.use(prodLogger)
}

// ====================================
// PHASE II: RATE LIMITING
// ====================================

// Apply general rate limiter to all routes
app.use("/api/", apiLimiter)

// Apply strict rate limiting to auth routes
app.use("/api/auth/login", authLimiter)
app.use("/api/auth/register", authLimiter)

// ====================================
// ROUTES
// ====================================

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/installations", require("./routes/installationRoutes"))
app.use("/api/maintenance", require("./routes/maintenanceRoutes"))
app.use("/api/tickets", require("./routes/ticketRoutes"))
app.use("/api/equipment", require("./routes/equipmentRoutes"))

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SunServe API is running successfully",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    phase: "Phase II - Enhanced Security & Performance",
  })
})

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// ====================================
// PHASE II: ERROR HANDLING
// ====================================

// Log errors
app.use(logError)

// Error handling middleware (must be last)
app.use(errorHandler)

// ====================================
// START SERVER
// ====================================

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(
    `🚀 SunServe server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  )
  console.log(`✨ Phase II enhancements active:`)
  console.log(`   ✅ Rate limiting enabled`)
  console.log(`   ✅ Input sanitization active`)
  console.log(`   ✅ Security headers configured`)
  console.log(`   ✅ Request logging enabled`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})

module.exports = app
