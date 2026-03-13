const express = require("express")
const router = express.Router()
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  closeTicket,
} = require("../controllers/ticketController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/authorize")
const { validateFields } = require("../middleware/validate")
const { USER_ROLES } = require("../utils/constants")

// Protect all routes
router.use(protect)

router
  .route("/")
  .post(validateFields(["title", "description", "category"]), createTicket)
  .get(getTickets)

router
  .route("/:id")
  .get(getTicket)
  .put(updateTicket)
  .delete(authorize(USER_ROLES.ADMIN), deleteTicket)

// Close ticket
router.post("/:id/close", authorize(USER_ROLES.TECHNICIAN, USER_ROLES.MANAGER, USER_ROLES.ADMIN), closeTicket)

module.exports = router
