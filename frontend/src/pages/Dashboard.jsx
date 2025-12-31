import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
  const fetchUser = async () => {
    setLoading(true); // 🔴 VERY IMPORTANT

    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load dashboard user", err);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [location.state]);

  
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return <p>Unable to load user data.</p>;
  }

  // ✅ Profile completion rule (single source of truth)
  const isProfileComplete = !!user.name && !!user.phone;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h2>Dashboard</h2>

      {/* Profile Completion Banner */}
      {!isProfileComplete && (
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffeeba",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "6px",
          }}
        >
          <p style={{ marginBottom: "10px" }}>
            ⚠️ Complete your profile to continue using RideConnect.
          </p>
          <button onClick={() => navigate("/profile")}>
            Go to Profile
          </button>
        </div>
      )}

      {/* Welcome Card */}
      <div style={cardStyle}>
        <h3>Welcome</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.name || "Not set"}</p>
        <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
      </div>

      {/* Profile Status */}
      <div style={cardStyle}>
        <h3>Profile Status</h3>

        {isProfileComplete ? (
          <p style={{ color: "green" }}>✅ Profile complete</p>
        ) : (
          <p style={{ color: "orange" }}>
            ⚠️ Profile incomplete (Name & Phone required)
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div style={cardStyle}>
        <h3>Quick Actions</h3>

        <Link to="/profile">
          <button style={{ marginRight: "10px" }}>View Profile</button>
        </Link>

        <Link to="/profile">
          <button>Edit Profile</button>
        </Link>
      </div>

      {/* Ride Actions (Future-Safe Gated Section) */}
      <div style={cardStyle}>
        <h3>My Rides</h3>

        <button disabled={!isProfileComplete}>
          Book Ride
        </button>

        {!isProfileComplete && (
          <p style={{ fontSize: "14px", color: "#777", marginTop: "8px" }}>
            Complete your profile to enable ride features.
          </p>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f9f9f9",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "6px",
};

export default Dashboard;
