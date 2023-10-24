const { Router } = require ("express")
const { getCarts, getCartById, createCart, updateCart, deleteCart, deleteProductOfCart } = require ("../controllers/carts.controller.js")

const router = Router()

router.get("/", getCarts)
router.get("/:cid", getCartById)
router.post("/", createCart)
router.put("/:cid/product/:pid", updateCart)
router.delete("/:cid", deleteCart)
router.delete("/:cid/product/:pid", deleteProductOfCart)

module.exports = { router }