import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Order from "./pages/Order/Order";
import Tracking from "./pages/Tracking/Tracking";
import Favorites from "./pages/Favorites/Favorites";
import Profile from "./pages/Profile/Profile";
import RestaurantOrders from "./pages/RestaurantOrders/RestaurantOrders";


function App() {
  return (
    <Routes>

      {/* Unprotected */}

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />


      {/* User Protected */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />


      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />


      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />


      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />


      <Route
        path="/tracking/:orderId"
        element={
          <ProtectedRoute>
            <Tracking />
          </ProtectedRoute>
        }
      />


      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />


      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* Restaurant */}

      <Route
        path="/restaurant-orders"
        element={
          <ProtectedRoute allowedRoles={["restaurant"]}>
            <RestaurantOrders />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}


export default App;