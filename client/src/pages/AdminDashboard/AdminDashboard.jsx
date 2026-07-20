import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineUsers, HiOutlineBuildingStorefront, HiOutlineClipboardDocumentList, HiOutlineCake } from "react-icons/hi2";
import { getUsers, getRestaurants, getAllOrders } from "../../services/admin.service";
import { getPublicFoodItems } from "../../services/food.service";

const tabs = [
  { key: "users", label: "Users", icon: <HiOutlineUsers size={18} /> },
  { key: "restaurants", label: "Restaurants", icon: <HiOutlineBuildingStorefront size={18} /> },
  { key: "orders", label: "Orders", icon: <HiOutlineClipboardDocumentList size={18} /> },
  { key: "foods", label: "Foods", icon: <HiOutlineCake size={18} /> },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

   return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4">
      <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-800 bg-[#111111]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-black">Welcome back, {user?.fullName || "Admin"}</h1>
            <p className="mt-2 text-neutral-400 max-w-2xl">
              Manage platform settings, monitor users, and review restaurant activity from here.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-neutral-950 transition hover:bg-amber-400"
          >
            Logout
          </button>
        </div>

        <div className="flex items-center gap-2 mb-8 border-b border-neutral-800 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeTab === tab.key
                  ? "bg-amber-500 text-neutral-950"
                  : "text-neutral-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "users" && <UsersTab />}
        {activeTab === "restaurants" && <RestaurantsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "foods" && <FoodsTab />}
      </div>
    </div>
  );
};

// ===================== Users tab =====================
const UsersTab = () => {
  const [status, setStatus] = useState("loading"); 
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    // getUsers never sends a response on the backend — timeout instead
    // of hanging forever. Safe to remove once that's fixed.
    const timeout = setTimeout(() => {
      if (!cancelled) setStatus("blocked");
    }, 4000);

    getUsers()
      .then((data) => {
        clearTimeout(timeout);
        if (!cancelled) {
          setUsers(data.users || []);
          setStatus("done");
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        if (!cancelled) setStatus("blocked");
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  if (status === "loading") {
    return <p className="text-neutral-400">Loading users...</p>;
  }

  if (status === "blocked") {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-8 text-center">
        <p className="text-amber-300 font-semibold mb-2">Backend fix required</p>
        <p className="text-neutral-400 text-sm">
          <code className="text-neutral-300">GET /api/admin/users</code> doesn't send a
          response back, so this list can't load yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-400 border-b border-neutral-800">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Email</th>
            <th className="py-3 pr-4 font-semibold">Phone</th>
            <th className="py-3 pr-4 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-neutral-500 text-center">
                No customer accounts found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id} className="border-b border-neutral-900">
                <td className="py-3 pr-4 text-white font-medium">{u.fullName}</td>
                <td className="py-3 pr-4 text-neutral-300">{u.email}</td>
                <td className="py-3 pr-4 text-neutral-500">{u.phone || "—"}</td>
                <td className="py-3 pr-4 text-neutral-500">
                  {new Date(u.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ===================== Restaurants tab =====================
const RestaurantsTab = () => {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getRestaurants()
      .then((data) => setRestaurants(data.restaurants || []))
      .catch(() => setError("Failed to load restaurants."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3 mb-5 text-amber-300 text-xs">
        Showing restaurant owner accounts — Restaurant model has no status
        field yet, so approve/suspend is disabled below.
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-neutral-400">Loading restaurants...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-800">
                <th className="py-3 pr-4 font-semibold">Owner Name</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Joined</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-neutral-500 text-center">
                    No restaurant accounts found.
                  </td>
                </tr>
              ) : (
                restaurants.map((r) => (
                  <tr key={r._id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-white font-medium">{r.fullName}</td>
                    <td className="py-3 pr-4 text-neutral-300">{r.email}</td>
                    <td className="py-3 pr-4 text-neutral-500">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                   <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button
                          disabled
                          title="No status field exists on the Restaurant model yet"
                          className="text-xs font-bold text-neutral-600 border border-neutral-800 rounded-lg px-3 py-1.5 cursor-not-allowed"
                        >
                          Approve / Suspend
                        </button>
                        <button
                          disabled
                          title="No admin delete/disable route exists on the backend yet"
                          className="text-xs font-bold text-neutral-600 border border-neutral-800 rounded-lg px-3 py-1.5 cursor-not-allowed"
                        >
                          Disable
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ===================== Orders tab =====================
const orderStatuses = ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const OrdersTab = () => {
  const [status, setStatus] = useState("loading"); 
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [restaurantOptions, setRestaurantOptions] = useState([]);

 
  useEffect(() => {
    getRestaurants()
      .then((data) => setRestaurantOptions(data.restaurants || []))
      .catch(() => setRestaurantOptions([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (restaurantFilter) filters.restaurantId = restaurantFilter;

    // GET /api/admin/orders doesn't exist on the backend yet.
    const timeout = setTimeout(() => {
      if (!cancelled) setStatus("blocked");
    }, 4000);

    getAllOrders(filters)
      .then((data) => {
        clearTimeout(timeout);
        if (!cancelled) {
          setOrders(data.orders || []);
          setStatus("done");
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        if (!cancelled) setStatus("blocked");
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [statusFilter, restaurantFilter]);

  if (status === "blocked") {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-6 py-8 text-center">
        <p className="text-amber-300 font-semibold mb-2">Backend support required</p>
        <p className="text-neutral-400 text-sm">
          <code className="text-neutral-300">GET /api/admin/orders</code> doesn't exist yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3 mb-5 text-amber-300 text-xs">
        Restaurant filter uses the same account list as the Restaurants tab —
        won't match real orders correctly until that's pointed at the actual
        Restaurant model instead of User accounts.
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            statusFilter === "" ? "bg-amber-500 text-neutral-950" : "bg-zinc-900 text-neutral-400"
          }`}
        >
          All Statuses
        </button>
        {orderStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              statusFilter === s ? "bg-amber-500 text-neutral-950" : "bg-zinc-900 text-neutral-400"
            }`}
          >
            {s}
          </button>
        ))}

        <select
          value={restaurantFilter}
          onChange={(e) => setRestaurantFilter(e.target.value)}
          className="ml-auto bg-zinc-900 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-full px-3 py-1.5"
        >
          <option value="">All Restaurants</option>
          {restaurantOptions.map((r) => (
            <option key={r._id} value={r._id}>
              {r.fullName}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" ? (
        <p className="text-neutral-400">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-800">
                <th className="py-3 pr-4 font-semibold">Order ID</th>
                <th className="py-3 pr-4 font-semibold">Restaurant</th>
                <th className="py-3 pr-4 font-semibold">Customer</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-neutral-500 text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-white font-medium">{o.orderId}</td>
                    <td className="py-3 pr-4 text-neutral-300">
                      {o.restaurantId?.restaurantName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-neutral-300">
                      {o.userId?.fullName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-amber-400 font-semibold">{o.orderStatus}</td>
                    <td className="py-3 pr-4 text-neutral-300">₹{o.totalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
// ===================== Foods tab =====================
const FoodsTab = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicFoodItems()
      .then((data) => setItems(data.FoodItems || []))
      .catch(() => setError("Failed to load food items."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3 mb-5 text-amber-300 text-xs">
        Reusing the public menu endpoint — only shows items currently marked
        available. Delete/Disable is shown but disabled: the backend only
        lets a restaurant delete its own items, with no admin override yet.
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-neutral-400">Loading food items...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-800">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Restaurant</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">Price</th>
                <th className="py-3 pr-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-neutral-500 text-center">
                    No food items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-b border-neutral-900">
                    <td className="py-3 pr-4 text-white font-medium">{item.name}</td>
                    <td className="py-3 pr-4 text-neutral-300">
                      {item.restaurantId?.restaurantName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-neutral-400">{item.category}</td>
                    <td className="py-3 pr-4 text-neutral-300">₹{item.price}</td>
                    <td className="py-3 pr-4">
                      <button
                        disabled
                        title="No admin delete/disable route exists on the backend yet"
                        className="text-xs font-bold text-neutral-600 border border-neutral-800 rounded-lg px-3 py-1.5 cursor-not-allowed"
                      >
                        Delete / Disable
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;