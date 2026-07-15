import api from "./auth.service";


export const placeOrder = async (orderData) => {

  const { data } = await api.post(
    "/api/order/placeOrder",
    orderData
  );

  return data;

};


export const getMyOrders = async () => {

  const { data } = await api.get(
    "/api/order/myOrders"
  );

  return data;

};


export const cancelOrder = async (orderId) => {

  const { data } = await api.patch(
    `/api/order/${orderId}`,
    {
      orderStatus: "Cancelled"
    }
  );

  return data;

};


// LIVE ORDER TRACKING
export const trackOrder = async (orderId) => {

  const { data } = await api.get(
    `/api/order/track/${orderId}`
  );

  return data;

};


// RESTAURANT ORDERS
export const getRestaurantOrders = async () => {

  const { data } = await api.get(
    "/api/order/restaurantOrders"
  );

  return data;

};


// UPDATE ORDER STATUS (Restaurant)
export const updateOrderStatus = async (orderId, orderStatus) => {

  const { data } = await api.patch(
    `/api/order/${orderId}`,
    {
      orderStatus
    }
  );

  return data;

};