import { useNavigate } from "react-router-dom";

const DriverStatus = () => {
  const navigate = useNavigate();

  return (
    <div className="status-card">
      <h2>Under Verification</h2>
      <p>Your documents are being reviewed.</p>

      <button onClick={() => navigate("/driver/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default DriverStatus;
