import crypto from 'crypto'
import Order from '../models/order.js';
import foodItems from '../models/foodItem.js';
export const PlaceOrder = async (req, res) => {
    try {
        let { restaurantId, items, deliveryAddress } = req.body; // items return array consisting of objects returning foodItem id and quantity
        if (!restaurantId || !items || items.length === 0 || !deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: "Restaurant ID, items, and delivery address are required"
            })
        }
        const user = req.user // considering authMiddleware sets req.user 
        //only normal user can place order 
        if (user.role != 'user') {
            return res.status(403).json({
                success: false,
                message: "only user can place orders",
            })
        }

        const orderId = `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

        let orderItems = []
        
        for(let item of items){
            let findItem = await foodItems.findById(item.foodItemId)
            if (!findItem) {
                return res.status(404).json({
                    success: false,
                    message: "No food item found",
                    
                })
            }

            if(!findItem.isAvailable){
                return res.status(404).json({
                    success: false,
                    message: " Some items are out of stock",
                    
                })
            }

            orderItems.push ({
                foodItemId: item.foodItemId,
                name: findItem.name,
                price: findItem.price,
                quantity: item.quantity,
                subtotal: item.quantity * findItem.price
            })
        }

        let totalAmount = orderItems.reduce((acc, ci) => acc + ci.subtotal, 0)

        let placeOrder = await Order.create({
            orderId,
            userId: user._id,
            restaurantId,
            items: orderItems
            ,
            totalAmount,
            deliveryAddress
        })

        return res.status(201).json({
            success: true,
            message: "order placed successfully",
            order: placeOrder
        })

    }
    catch (error) {
        return res
            .status(500)
            .json({
                error: error.message,
                success: false,
            });
    }
}

