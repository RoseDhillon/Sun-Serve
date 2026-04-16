const morgan = require("morgan")
const fs = require("fs")
const path = require("path")

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../../logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
})

// Development logging format
const devLogger = morgan("dev")

// Production logging format - log to file
const prodLogger = morgan("combined", { stream: accessLogStream })

// Custom format for detailed logging
morgan.token("user-id", (req) => {
  return req.user ? req.user._id : "anonymous"
})

morgan.token("body", (req) => {
  return JSON.stringify(req.body)
})

const detailedLogger = morgan(
  ":method :url :status :response-time ms - :user-id - :date[iso]",
  { stream: accessLogStream },
)

// Error logger
const logError = (err, req, res, next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", errorLog)
  }

  // Log to file
  const errorLogStream = fs.createWriteStream(path.join(logsDir, "error.log"), {
    flags: "a",
  })
  errorLogStream.write(JSON.stringify(errorLog) + "\n")

  next(err)
}

module.exports = {
  devLogger,
  prodLogger,
  detailedLogger,
  logError,
}
