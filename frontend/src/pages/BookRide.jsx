import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/bookRide.css";

function BookRide() {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const canContinue = pickup.trim() !== "" && drop.trim() !== "";

  return (
    <div className="bookride-page">

      {/* =========================
         HEADER
         ========================= */}
      <div className="bookride-header">
        <h2>Book a Ride</h2>
        <p>Enter your trip details to continue</p>
      </div>

      {/* =========================
         BOOKING CARD
         ========================= */}
      <div className="bookride-card">

        {/* Pickup */}
        <div className="input-group">
          <label>Pickup Location</label>
          <input
            type="text"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>

        {/* Drop */}
        <div className="input-group">
          <label>Drop Location</label>
          <input
            type="text"
            placeholder="Enter drop location"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
          />
        </div>

        {/* CTA */}
        <button
  className="primary-btn"
  disabled={!canContinue}
  onClick={() =>
    navigate("/ride-summary", {
      state: { pickup, drop }
    })
  }
>
  Continue
</button>


        {!canContinue && (
          <p className="hint-text">
            Enter both pickup and drop locations to continue
          </p>
        )}
      </div>
    </div>
  );
}

export default BookRide;
