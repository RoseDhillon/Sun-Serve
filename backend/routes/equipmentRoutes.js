const express = require("express")
const router = express.Router()
const {
  createEquipment,
  getEquipment,
  getEquipmentItem,
  updateEquipment,
  deleteEquipment,
  getLowStockEquipment,
} = require("../controllers/equipmentController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/authorize")
const { validateFields } = require("../middleware/validate")
const { USER_ROLES } = require("../utils/constants")

// Protect all routes
router.use(protect)

// Low stock route must come before /:id to avoid conflict
router.get(
  "/lowstock",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  getLowStockEquipment,
)

router
  .route("/")
  .post(
    authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
    validateFields([
      "name",
      "category",
      "manufacturer",
      "model",
      "quantity",
      "unitPrice",
      "supplier",
    ]),
    createEquipment,
  )
  .get(getEquipment)

router
  .route("/:id")
  .get(getEquipmentItem)
  .put(authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), updateEquipment)
  .delete(authorize(USER_ROLES.ADMIN), deleteEquipment)

module.exports = router
