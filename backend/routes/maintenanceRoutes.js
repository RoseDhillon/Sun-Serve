const express = require("express")
const router = express.Router()
const {
  createMaintenanceRequest,
  getMaintenanceRequests,
  getMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} = require("../controllers/maintenanceController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/authorize")
const { validateFields } = require("../middleware/validate")
const { USER_ROLES } = require("../utils/constants")

// Protect all routes
router.use(protect)

router
  .route("/")
  .post(
    authorize(USER_ROLES.CUSTOMER),
    validateFields(["installation", "requestType", "description"]),
    createMaintenanceRequest,
  )
  .get(getMaintenanceRequests)

router
  .route("/:id")
  .get(getMaintenanceRequest)
  .put(
    authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN),
    updateMaintenanceRequest,
  )
  .delete(authorize(USER_ROLES.ADMIN), deleteMaintenanceRequest)

module.exports = router
