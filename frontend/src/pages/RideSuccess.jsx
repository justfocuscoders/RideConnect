import { useNavigate } from "react-router-dom";
import "../assets/styles/bookRide.css";

function RideSuccess() {
  const navigate = useNavigate();

  return (
    <div className="bookride-page">

      {/* Success Card */}
      <div className="success-card">
        <div className="success-icon">✓</div>

        <h2>Ride Booked Successfully</h2>

        <p className="success-text">
          Your ride has been confirmed. A driver will be assigned shortly.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

    </div>
  );
}

export default RideSuccess;
