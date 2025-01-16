import { Router } from "express";
import { addToCart, deleteFromCart, fetchCartByUserId, updateCart } from "../controller/cart.controller.js";
 
 
 

const router = Router();
router.route("/create").post(addToCart);
router.route("/:userId").get(fetchCartByUserId);
router.route("/:itemId").delete(deleteFromCart);
router.route("/edit/:itemId").patch(updateCart);
 

export default router;
