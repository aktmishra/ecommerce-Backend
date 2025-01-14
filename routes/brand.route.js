import { Router } from "express";
import { createBrand, fetchBrands } from "../controller/brand.controller.js";
 
 

const router = Router();
router.route("/create").post(createBrand);
router.route("/").get(fetchBrands);
 

export default router;
