const { Router } = require ('express')
const { getUsers, getUserByEmail, getUserById, createUser, updateUser, deleteUser, uploadDocumentUser } = require ('../controllers/users.controller.js')

const router = Router()

router.get("/", getUsers)
router.get("/search/:email", getUserByEmail)
router.get("/:uid", getUserById)
router.post("/", createUser)
router.put("/:uid", updateUser)
router.delete("/:uid", deleteUser)
router.post("/uid/documents", uploadDocumentUser)

module.exports = { router }