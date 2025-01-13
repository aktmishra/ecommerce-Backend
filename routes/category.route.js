import { Router } from "express";
import { createCategory, fetchCategories } from "../controller/category.controller.js";
 

const router = Router();
router.route("/create").post(createCategory);
router.route("/").get(fetchCategories);
 

export default router;
