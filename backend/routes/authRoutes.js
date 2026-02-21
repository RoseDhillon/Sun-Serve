const express = require("express")
const router = express.Router()
const { register, login, getMe } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { validateFields, validateEmail } = require("../middleware/validate")

// Public routes
router.post(
  "/register",
  validateFields(["name", "email", "password", "phone", "address"]),
  validateEmail,
  register,
)

router.post(
  "/login",
  validateFields(["email", "password"]),
  validateEmail,
  login,
)

// Protected routes
router.get("/me", protect, getMe)

module.exports = router
