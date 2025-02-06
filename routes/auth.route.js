import { Router } from "express";
import { createUser, loginUser } from "../controller/auth.controller.js";
import passport from "passport";
 
 

const router = Router();
router.route("/signup").post(createUser);
router.route("/login").post(passport.authenticate("local"), loginUser);

export default router;
