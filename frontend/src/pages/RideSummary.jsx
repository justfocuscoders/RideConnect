import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/bookRide.css";

function RideSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const { pickup, drop } = location.state || {};

  // Guard: if user refreshes or lands here directly
  if (!pickup || !drop) {
    navigate("/book-ride");
    return null;
  }

  return (
    <div className="bookride-page">

      {/* Header */}
      <div className="bookride-header">
        <h2>Ride Summary</h2>
        <p>Please review your trip details</p>
      </div>

      {/* Summary Card */}
      <div className="bookride-card">

        <div className="summary-row">
          <span>Pickup</span>
          <strong>{pickup}</strong>
        </div>

        <div className="summary-row">
          <span>Drop</span>
          <strong>{drop}</strong>
        </div>

        <hr />

        <div className="summary-row">
          <span>Estimated Distance</span>
          <strong>8.2 km</strong>
        </div>

        <div className="summary-row">
          <span>Estimated Fare</span>
          <strong>₹180</strong>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/ride-success")}
        >
          Confirm Ride
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate(-1)}
        >
          Edit Locations
        </button>
      </div>
    </div>
  );
}

export default RideSummary;
