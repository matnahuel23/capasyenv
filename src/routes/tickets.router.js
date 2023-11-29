const { Router } = require ("express")
const { getTickets,getTicketById,updateTicket,deleteTicket } = require ("../controllers/tickets.controller")
const router = Router()

router.get("/", getTickets)
router.get("/:tid", getTicketById)
router.put("/:tid", updateTicket)
router.delete("/:tid", deleteTicket)

module.exports = { router }