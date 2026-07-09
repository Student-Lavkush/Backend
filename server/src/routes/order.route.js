import { Router } from "express"; 
import { PlaceOrder } from "../controllers/order.controllers";
const router = Router()

router.post('placeOrder', PlaceOrder)

export default router;