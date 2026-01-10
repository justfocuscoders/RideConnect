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
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserDashboard from "./user/pages/UserDashboard";

/* Admin */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";

/* Driver */
import DriverDashboard from "./driver/pages/DriverDashboard";

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

        {/* Protected User Pages */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
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
          <ProtectedRoute role="driver">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
