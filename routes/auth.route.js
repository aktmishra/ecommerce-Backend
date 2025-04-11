import { Router } from "express";
import { checkUser, createUser, loginUser } from "../controller/auth.controller.js";
import { checkUser, createUser, loginUser } from "../controller/auth.controller.js";
import passport from "passport";
 
 

const router = Router();
router.route("/signup").post(createUser);
router.route("/login").post(passport.authenticate("local"), loginUser);
router.route("/check").get(passport.authenticate("jwt"), checkUser);

export default router;
