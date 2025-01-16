import express from "express";
import { signup,login,logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);
router.put("/update-profile",protectRoute,updateProfile);//protectroute mean only authenticate user can update profile if authenticate then call next() for update profile
router.get("/check",protectRoute,checkAuth);

export default router;
