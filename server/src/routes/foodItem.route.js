import { Router } from "express";
const router = Router()
import authMiddleware from "../middlewares/auth.middleware.js";
import { createFoodItem , getAllFoodItems , updateFoodInfo ,getFoodItemsByCategory , deleteFoodItem} from "../controllers/foodItem.controllers.js";

//Adding new food items in the restraurant menu 
router.post('/newFoodItem',authMiddleware , createFoodItem)

//to display all food items for restaurant only
router.get('/AllFoodItems',authMiddleware , getAllFoodItems) 

//to display food items by category for restaurant only
router.get('/category/:category', authMiddleware , getFoodItemsByCategory) 

//to update food item for restaurant only
router.patch('/:id',authMiddleware, updateFoodInfo)

//to delete food item for restaurant only 
router.delete('/:id',authMiddleware, deleteFoodItem)

export default router