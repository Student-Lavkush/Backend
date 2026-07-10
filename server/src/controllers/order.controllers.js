import crypto from 'crypto'
import Order from '../models/order.js';
import foodItems from '../models/foodItem.js';
import Restaurant from '../models/restaurant.js';
import { get } from 'http';
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

        for (let item of items) {
            let findItem = await foodItems.findById(item.foodItemId)
            if (!findItem) {
                return res.status(404).json({
                    success: false,
                    message: "No food item found",

                })
            }

            if (!findItem.isAvailable) {
                return res.status(404).json({
                    success: false,
                    message: " Some items are out of stock",

                })
            }

            orderItems.push({
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

export const getRestaurantOrders = async (req, res) => {
    try {
        const user = req.user
        if (user.role !== 'restaurant') {
            return res.status(403).json({
                success: false,
                message: "only restaurants can view there orders",
            })
        }

        const getRestaurant = await Restaurant.findOne({ owner: user._id })
        if (!getRestaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }

        const getOrders = await Order.find({ restaurantId: getRestaurant._id })

        if (getOrders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders are placed"
            })
        }

        return res.status(200).json({
            success: true,
            Orders: getOrders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params; // pass the generated order id like ORD-7898G3
        const { orderStatus } = req.body

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Need to send order id first",
            })
        }


        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: "Need to send status",
            })
        }

        const user = req.user
        if (user.role !== 'restaurant') {
            return res.status(403).json({
                success: false,
                message: "only restaurants can update there order details",
            })
        }

        const restaurant = await Restaurant.findOne({owner:user._id})
        if (!restaurant) {
            return res.status(403).json({
                success: false,
                message: "Restuarant not found"
            })
        }
        
        const order = await Order.findOne({ orderId })

        if (!order) {
            return res.status(403).json({
                success: false,
                message: "No order of this id is avalible",
            })
        }

        if (order.restaurantId.toString === restaurant._id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access",
            })
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Order is already Completed",
            })
        }

        const updateStatus = await Order.findByIdAndUpdate(
            order._id,
            {orderStatus},
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            success: true,
            Status:updateStatus 
        });

    } catch (error) {
        return res
            .status(500)
            .json({
                error: error.message,
                success: false,
            });
    }
}