import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../css/BecomeDriver.css";

const BecomeDriver = () => {
  const navigate = useNavigate();

  // ============================
  // FORM STATE
  // ============================
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // ============================
  // SUBMIT HANDLER
  // ============================
  const submitDriverProfile = async (e) => {
    e.preventDefault();

    if (!licenseNumber || !vehicleNumber || !vehicleType) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/profile", {
        license_number: licenseNumber.trim().toUpperCase(),
        vehicle_number: vehicleNumber.trim().toUpperCase(),
        vehicle_type: vehicleType,
      });

      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="become-driver-page">
      <div className="driver-card">
        {/* HEADER */}
        <div className="driver-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Become a Driver</h1>
          <p className="subtitle">
            Provide your vehicle details to apply as a driver.
          </p>
        </div>

        {/* FORM */}
        {!submitted ? (
          <form onSubmit={submitDriverProfile} className="driver-form">
            <input
              type="text"
              placeholder="Driving License Number"
              value={licenseNumber}
              onChange={(e) =>
                setLicenseNumber(e.target.value.toUpperCase())
              }
            />

            <input
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(e.target.value.toUpperCase())
              }
            />

            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
            </select>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Submitting…" : "Submit for Verification"}
            </button>
          </form>
        ) : (
          // SUCCESS STATE
          <div className="success-box">
            <h3>✅ Application Submitted</h3>
            <p>
              Your driver application is <strong>under verification</strong>.
            </p>
            <p>You can track status from the Driver Dashboard.</p>

            <button
              className="primary-btn"
              onClick={() => navigate("/driver/dashboard")}
            >
              Go to Driver Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BecomeDriver;
