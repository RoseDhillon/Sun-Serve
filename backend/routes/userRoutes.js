const express = require("express")
const router = express.Router()
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersByRole,
} = require("../controllers/userController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/authorize")
const { USER_ROLES } = require("../utils/constants")

// Protect all routes
router.use(protect)

// Get all users - Admin only
router.get("/", authorize(USER_ROLES.ADMIN), getUsers)

// Get users by role - Admin/Manager
router.get(
  "/role/:role",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  getUsersByRole,
)

// Get, update, delete single user
router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(authorize(USER_ROLES.ADMIN), deleteUser)

module.exports = router
