import { Router } from "express";
import { createProduct, fetchAllProducts, fetchProductById, updateProduct } from "../controller/product.controller.js";

const router = Router();
router.route("/create").post(createProduct);
router.route("/").get(fetchAllProducts);
router.route("/:id").get(fetchProductById);
router.route("/edit/:id").patch(updateProduct);

export default router;
