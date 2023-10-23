import { Router } from 'express'
import { getUsers, getUserByEmail, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js'

const router = Router()

router.get("/", getUsers)
router.get("/search/:email", getUserByEmail)
router.get("/:uid", getUserById)
router.post("/", createUser)
router.put("/:uid", updateUser)
router.delete("/:uid", deleteUser);

export default router