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
import AdminDrivers from "./admin/pages/AdminDrivers";

/* Driver */
import DriverDashboard from "./driver/pages/DriverDashboard";

/* Driver Onboarding */
import AccountCheck from "./driver-onboarding/pages/AccountCheck";
import DriverRegister from "./driver-onboarding/pages/DriverRegister";
import DriverStatus from "./driver-onboarding/pages/DriverStatus";

/* Context */
import { DriverOnboardingProvider } from "./driver-onboarding/context/DriverOnboardingContext";

/* User Action */
import BecomeDriver from "./user/pages/BecomeDriver";

function App() {
  return (
    <DriverOnboardingProvider>
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

          {/* Driver Onboarding */}
          <Route path="driver/onboarding" element={<AccountCheck />} />
          <Route path="driver/register" element={<DriverRegister />} />
          <Route path="driver/status" element={<DriverStatus />} />

          {/* User */}
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

          <Route
            path="become-driver"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <BecomeDriver />
              </ProtectedRoute>
            }
          />
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
          <Route path="drivers" element={<AdminDrivers />} />
        </Route>
      </Routes>
    </DriverOnboardingProvider>
  );
}

export default App;
