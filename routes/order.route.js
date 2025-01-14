import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  fetchOrdersByUserId,
  updateOrder,
} from "../controller/order.controller.js";

const router = Router();
router.route("/create").post(createOrder);
router.route("/:userId").get(fetchOrdersByUserId);
router.route("/:orderId").delete(deleteOrder);
router.route("/:orderId").patch(updateOrder);

export default router;
