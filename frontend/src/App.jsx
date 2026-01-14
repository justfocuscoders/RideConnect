import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/routing/ProtectedRoute";

/* Public Pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import BookRide from "./pages/BookRide";
import RideSummary from "./pages/RideSummary";
import RideSuccess from "./pages/RideSuccess";

/* User */
import Profile from "./pages/Profile";
import UserDashboard from "./user/pages/UserDashboard";

/* Admin */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";

/* Driver */
import DriverDashboard from "./driver/pages/DriverDashboard";

import BecomeDriver from "./user/pages/BecomeDriver";
import AdminDrivers from "./admin/pages/AdminDrivers";



function App() {
  return (
    <Routes>
      {/* ================= USER LAYOUT ================= */}
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="book-ride" element={<BookRide />} />
        <Route path="ride-summary" element={<RideSummary />} />
        <Route path="ride-success" element={<RideSuccess />} />
        <Route path="/admin/drivers" element={<AdminDrivers />} />


        {/* ================= USER ================= */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* ================= DRIVER ================= */}
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/become-driver"
  element={
    <ProtectedRoute allowedRoles={["user"]}>
      <BecomeDriver />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;
