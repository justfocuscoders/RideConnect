import { useState, useEffect } from "react";
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
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // ============================
  // SUBMIT HANDLER
  // ============================
  const submitDriverProfile = async (e) => {
    e.preventDefault();

    if (!licenseNumber || !vehicleNumber || !vehicleType) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/profile", {
        license_number: licenseNumber,
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType,
      });

      setSuccess(true);
      setLoading(false);

      // Remove token but let user SEE success first
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Driver profile creation failed", err);
      setError(
        err.response?.data?.detail || "Failed to create driver profile"
      );
      setLoading(false);
    }
  };

  // ============================
  // AUTO REDIRECT AFTER SUCCESS
  // ============================
  useEffect(() => {
    if (!success) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [success, navigate]);

  // ============================
  // UI
  // ============================
  return (
    <div className="page-container">
      <h1>Driver Registration</h1>
      <p>Complete the details below to start driving.</p>

      <form onSubmit={submitDriverProfile} className="form-card">
        <input
          type="text"
          placeholder="Driving License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          disabled={success}
        />

        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          disabled={success}
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          disabled={success}
        >
          <option value="">Select Vehicle Type</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="auto">Auto</option>
        </select>

        {/* ERROR MESSAGE */}
        {error && <p className="form-error">{error}</p>}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="form-success">
            <h3>🎉 Driver profile created!</h3>
            <p>
              Your account has been upgraded to <strong>Driver</strong>.
            </p>
            <p>Redirecting to login in {countdown} seconds…</p>
          </div>
        )}

        {!success && (
          <button type="submit" disabled={loading}>
            {loading ? "Submitting…" : "Create Driver Profile"}
          </button>
        )}
      </form>
    </div>
  );
};

export default BecomeDriver;
