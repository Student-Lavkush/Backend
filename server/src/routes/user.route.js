import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

// Fix the folder name here by adding the 's'
import {isLoggedIn} from "../middlewares/auth.middleware.js"; 


const router = Router();

// Get logged-in user profile
router.get("/profile", isLoggedIn, getProfile);

// Update logged-in user profile
router.put("/profile", isLoggedIn, updateProfile);

export default router;