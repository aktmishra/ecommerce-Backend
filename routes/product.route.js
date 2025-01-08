import { Router } from "express";
import { createProduct } from "../controller/product.controller.js";

const router = Router();
router.route("/create").post(createProduct);

export default router;
