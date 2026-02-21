const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/database")
const errorHandler = require("./middleware/errorHandler")

// Load environment variables
dotenv.config({ path: "./backend/.env" })

// Initialize express app
const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mount routes
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
  })
})

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(
    `🚀 SunServe server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  )
})

module.exports = app
