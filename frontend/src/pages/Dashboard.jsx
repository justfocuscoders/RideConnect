import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/users/me");
      setUser(res.data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  const isProfileComplete = user.name && user.phone;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h2>Dashboard</h2>

      {/* Welcome Card */}
      <div style={cardStyle}>
        <h3>Welcome</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.name || "Not set"}</p>
      </div>

      {/* Profile Status */}
      <div style={cardStyle}>
        <h3>Profile Status</h3>

        {isProfileComplete ? (
          <p style={{ color: "green" }}>✅ Profile complete</p>
        ) : (
          <>
            <p style={{ color: "orange" }}>
              ⚠️ Profile incomplete (Name & Phone required)
            </p>
            <Link to="/profile">
              <button>Complete Profile</button>
            </Link>
          </>
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

      {/* Future Sections */}
      <div style={cardStyle}>
        <h3>My Rides</h3>
        <p>Coming soon</p>
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
