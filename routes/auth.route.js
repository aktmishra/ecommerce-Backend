import { Router } from "express";
import { checkUser, createUser, loginUser, logoutUser } from "../controller/auth.controller.js"
import passport from "passport";
 
 

const router = Router();
router.route("/signup").post(createUser);
router.route("/login").post(passport.authenticate("local"), loginUser);
router.route("/check").get(passport.authenticate("jwt"), checkUser);
router.route("/logout").get(passport.authenticate("jwt"), logoutUser);

export default router;
