import { useNavigate } from "react-router-dom";
import { useDriverOnboarding } from "../context/DriverOnboardingContext";

const DriverRegister = () => {
  const navigate = useNavigate();
  const { markPending } = useDriverOnboarding();

  const handleSubmit = () => {
    // UI only
    markPending();
    navigate("/driver/status");
  };

  return (
    <div className="onboarding-form">
      <h2>Driver Registration</h2>

      <input placeholder="City" />
      <input placeholder="Vehicle Type" />
      <input placeholder="Vehicle Number" />
      <input placeholder="Vehicle Model" />

      <p>Upload Documents (UI only)</p>
      <input type="file" />
      <input type="file" />

      <button onClick={handleSubmit}>Submit for Verification</button>
    </div>
  );
};

export default DriverRegister;
