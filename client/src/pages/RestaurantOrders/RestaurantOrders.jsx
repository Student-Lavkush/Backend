import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../services/order.service";


const statusOptions = [
  "Preparing",
  "Out for Delivery",
  "Delivered",
];


function RestaurantOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);


  useEffect(() => {
    fetchOrders();
  }, []);


  async function fetchOrders() {

    try {

      const data = await getRestaurantOrders();

      setOrders(data.Orders || []);

    } catch (error) {

      console.log(
        "Restaurant orders error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  async function changeStatus(orderId, status) {

    try {

      setUpdatingId(orderId);

      await updateOrderStatus(
        orderId,
        status
      );

      await fetchOrders();

    } catch(error) {

      console.log(
        "Update status error:",
        error
      );

    } finally {

      setUpdatingId(null);

    }

  }


  if (loading) {
    return (
      <h2 className="text-white p-10">
        Loading restaurant orders...
      </h2>
    );
  }


  return (

    <div className="min-h-screen bg-[#050505]">

      <Navbar />


      <div className="w-[95%] max-w-6xl mx-auto py-10">

        <h1 className="text-3xl font-black text-white mb-8">
          Restaurant Orders
        </h1>


        {
          orders.length === 0 ? (

            <div className="text-neutral-400">
              No orders received yet.
            </div>

          ) : (

            <div className="space-y-6">

              {
                orders.map((order)=>(

                  <div
                    key={order.orderId}
                    className="bg-zinc-900 border border-neutral-800 rounded-3xl p-6"
                  >

                    <div className="flex justify-between items-center mb-5">

                      <h2 className="text-white text-xl font-bold">
                        Order #{order.orderId}
                      </h2>


                      <span className="text-amber-500 font-bold">
                        {order.orderStatus}
                      </span>

                    </div>


                    <p className="text-neutral-400 mb-4">
                      Customer: {order.userId?.name || "Customer"}
                    </p>


                    <div className="space-y-3">

                      {
                        order.items.map((item)=>(

                          <div
                            key={item.foodItemId}
                            className="flex justify-between bg-black/40 rounded-xl p-3"
                          >

                            <span className="text-white">
                              {item.name} x {item.quantity}
                            </span>

                            <span className="text-amber-500">
                              ₹{item.subtotal}
                            </span>

                          </div>

                        ))
                      }

                    </div>


                    <div className="mt-5 flex justify-between items-center">

                      <p className="text-white font-bold">
                        Total: ₹{order.totalAmount}
                      </p>


                      {
                        order.orderStatus !== "Delivered" &&
                        order.orderStatus !== "Cancelled" &&

                        <select

                          disabled={
                            updatingId === order.orderId
                          }

                          value={order.orderStatus}

                          onChange={(e)=>
                            changeStatus(
                              order.orderId,
                              e.target.value
                            )
                          }

                          className="bg-black text-white border border-neutral-700 rounded-xl px-4 py-2"

                        >

                          <option value={order.orderStatus}>
                            {order.orderStatus}
                          </option>


                          {
                            statusOptions
                              .filter(
                                s => s !== order.orderStatus
                              )
                              .map(status=>(

                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>

                              ))
                          }

                        </select>

                      }


                    </div>


                  </div>

                ))
              }

            </div>

          )
        }


      </div>

    </div>

  );

}


export default RestaurantOrders;