import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ModeProtectedRoute from "./components/routing/ModeProtectedRoute";
import { MODES } from "./utils/mode";

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

/* Driver */
import DriverDashboard from "./driver/pages/DriverDashboard";

/* Driver Onboarding */
import AccountCheck from "./driver-onboarding/pages/AccountCheck";
import DriverRegister from "./driver-onboarding/pages/DriverRegister";
import DriverStatus from "./driver-onboarding/pages/DriverStatus";

/* Admin */
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminDrivers from "./admin/pages/AdminDrivers";

/* Context */
import { DriverOnboardingProvider } from "./driver-onboarding/context/DriverOnboardingContext";

/* User Action */
import BecomeDriver from "./user/pages/BecomeDriver";

import "./assets/styles/Navbar.css";


function App() {
  return (
    <DriverOnboardingProvider>
      <Routes>

        {/* ================= PUBLIC (NO HEADER / NO LOGOUT) ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/ride-summary" element={<RideSummary />} />
          <Route path="/ride-success" element={<RideSuccess />} />

          {/* Driver onboarding stays public */}
          <Route path="/driver/onboarding" element={<AccountCheck />} />
          <Route path="/driver/register" element={<DriverRegister />} />
          <Route path="/driver/status" element={<DriverStatus />} />
        </Route>

        {/* ================= AUTHENTICATED USER / DRIVER ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route
              path="/dashboard"
              element={
                <ModeProtectedRoute mode={MODES.PASSENGER}>
                  <UserDashboard />
                </ModeProtectedRoute>
              }
            />

            <Route
              path="/driver/dashboard"
              element={
                <ModeProtectedRoute mode={MODES.DRIVER}>
                  <DriverDashboard />
                </ModeProtectedRoute>
              }
            />

            <Route path="/profile" element={<Profile />} />

            <Route
              path="/become-driver"
              element={<BecomeDriver />}
            />

          </Route>
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/drivers" element={<AdminDrivers />} />
        </Route>

      </Routes>
    </DriverOnboardingProvider>
  );
}

export default App;
