import { Router } from "express"; 
import { PlaceOrder } from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router()

router.post('/placeOrder', authMiddleware ,PlaceOrder)

export default router;