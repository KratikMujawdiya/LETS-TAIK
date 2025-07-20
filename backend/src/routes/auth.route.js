import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);//protectRoute is used to check user can be authenticated or not 

router.get("/check", protectRoute, checkAuth);//Whenever i try refresh my profile page that time it will check wheather the user is authenticated or not 

export default router;
