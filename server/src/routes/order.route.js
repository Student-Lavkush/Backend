import { Router } from "express"; 
import { PlaceOrder , getRestaurantOrders , updateOrderStatus} from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router()

router.post('/placeOrder', authMiddleware ,PlaceOrder)

router.get('/restaurants',authMiddleware , getRestaurantOrders)

router.patch('/:orderId' , authMiddleware , updateOrderStatus)

export default router;