import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* =========================
     LOADING / INITIAL STATE
     ========================= */
  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="card skeleton-card" />
        <div className="card skeleton-card" />
      </div>
    );
  }

  const isProfileComplete = user.profile_complete;

  return (
    <div className="dashboard-page">

      {/* =========================
         PROFILE COMPLETION BANNER
         ========================= */}
      {!isProfileComplete && (
        <div className="dashboard-banner">
          <div className="banner-text">
            <h4>
              Profile incomplete ({user.missing_fields.length}/3)
            </h4>

            <p>
              Please complete the following to unlock all features:
            </p>

            <ul className="missing-list">
              {user.missing_fields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/profile")}
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* =========================
         MAIN DASHBOARD CONTENT
         ========================= */}
      <section className="dashboard-main">

        {/* -------- Profile Summary -------- */}
        <div className="card profile-card">
          <h3 className="card-title">Profile Summary</h3>

          <div className="profile-row">
            <span>Name</span>
            <strong>{user.name || "Not provided"}</strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-row">
            <span>Phone</span>
            <strong>{user.phone || "Not provided"}</strong>
          </div>

          <button
            className="btn-secondary"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </button>
        </div>

        {/* -------- Action Cards -------- */}
        <div className="action-cards">

          {/* Book Ride */}
          <div
            className={`card action-card ${
              !isProfileComplete ? "disabled" : ""
            }`}
          >
            <h4>Book a Ride</h4>
            <p>Request a new ride instantly.</p>

            <button
              className="btn-primary"
              disabled={!isProfileComplete}
            >
              Book Ride
            </button>

            {!isProfileComplete && (
              <small className="helper-text">
                Complete your profile to book a ride
              </small>
            )}
          </div>

          {/* Ride History */}
          <div className="card action-card">
            <h4>Ride History</h4>
            <p>View your previous rides.</p>

            <button className="btn-secondary">
              View History
            </button>
          </div>

          {/* Saved Locations */}
          <div className="card action-card disabled">
            <h4>Saved Locations</h4>
            <p>Coming soon</p>

            <button className="btn-secondary" disabled>
              Coming Soon
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Dashboard;
