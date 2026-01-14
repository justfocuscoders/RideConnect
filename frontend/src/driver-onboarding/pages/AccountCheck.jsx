import { useNavigate } from "react-router-dom";

const AccountCheck = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-card">
      <h2>Do you already have a RideConnect account?</h2>

      <button onClick={() => navigate("/login", { state: { from: "driver" } })}>
        Yes, I have an account
      </button>

      <button onClick={() => navigate("/signup", { state: { from: "driver" } })}>
        No, I'm new
      </button>
    </div>
  );
};

export default AccountCheck;
