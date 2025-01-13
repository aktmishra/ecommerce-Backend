import { Router } from "express";
import { createUser, fetchUserById, loginUser, updateUser } from "../controller/user.controller.js";
 

const router = Router();
router.route("/signup").post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(fetchUserById);
router.route("/edit/:id").patch(updateUser);

export default router;
