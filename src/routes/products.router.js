const { Router } = require ("express")
const { getProducts, getProductById, getProductByTitle, createProducts, deleteProduct, updateProduct } = require ("../controllers/products.controller.js")
const uploader = require('../utils/multer.js') 
const router = Router()

router.get("/", getProducts)
router.get("/:pid", getProductById)
router.get("/title/:title", getProductByTitle);
router.post("/", uploader.single('thumbnails'), createProducts)
router.put("/:pid", updateProduct)
router.delete("/:pid", deleteProduct)

module.exports = { router }