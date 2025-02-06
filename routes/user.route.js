import { Router } from "express";
import {fetchUserById,updateUser } from "../controller/user.controller.js";
 

const router = Router();
router.route("/:id").get(fetchUserById);
router.route("/edit/:id").patch(updateUser);

export default router;
