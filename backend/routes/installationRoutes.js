const express = require("express")
const router = express.Router()
const {
<<<<<<< HEAD
  createInstallation,
  getInstallations,
  getInstallation,
  updateInstallation,
  deleteInstallation,
=======
    createInstallation,
    getInstallations,
    getInstallation,
    updateInstallation,
    deleteInstallation,
>>>>>>> 7eb2a13d4a70c932e2a7f14c3f784321c82addab
} = require("../controllers/installationController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/authorize")
const { validateFields } = require("../middleware/validate")
const { USER_ROLES } = require("../utils/constants")

// Protect all routes
router.use(protect)

router
<<<<<<< HEAD
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
=======
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
>>>>>>> 7eb2a13d4a70c932e2a7f14c3f784321c82addab

module.exports = router
