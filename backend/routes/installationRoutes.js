const express = require("express")
const router = express.Router()
const {
  createInstallation,
  getInstallations,
  getInstallation,
  updateInstallation,
  deleteInstallation,
} = require("../controllers/installationController")
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
    validateFields([
      "address",
      "systemSize",
      "panelType",
      "numberOfPanels",
      "estimatedCost",
    ]),
    createInstallation,
  )
  .get(getInstallations)

router
  .route("/:id")
  .get(getInstallation)
  .put(authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), updateInstallation)
  .delete(authorize(USER_ROLES.ADMIN), deleteInstallation)

module.exports = router
