import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MODES } from "../../utils/mode";

const ModeProtectedRoute = ({ mode, children }) => {
  const { user, loading, activeMode } = useAuth();

  if (loading) return null;

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin untouched (let admin routes handle themselves)
  if (user.role === "admin") {
    return children;
  }

  // Passenger route
  if (mode === MODES.PASSENGER) {
    if (activeMode !== MODES.PASSENGER) {
      return <Navigate to="/driver/dashboard" replace />;
    }
    return children;
  }

  // Driver route
  if (mode === MODES.DRIVER) {
    if (
      user.role !== "driver" ||
      user.driver_status !== "verified"
    ) {
      return <Navigate to="/dashboard" replace />;
    }

    if (activeMode !== MODES.DRIVER) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  }

  // Fallback safety
  return <Navigate to="/dashboard" replace />;
};

export default ModeProtectedRoute;
