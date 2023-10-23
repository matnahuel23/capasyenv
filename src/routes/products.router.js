import { Router } from "express";
import { getProducts, getProductById, getProductByTitle, createProducts, deleteProduct, updateProduct } from "../controllers/products.controller.js";

const router = Router()

router.get("/", getProducts)
router.get("/:pid", getProductById)
router.get("/search:title", getProductByTitle);
router.post("/", createProducts)
router.put("/:pid", updateProduct)
router.delete("/:pid", deleteProduct)

export default router