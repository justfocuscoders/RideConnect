import { useNavigate } from "react-router-dom";

const BecomeDriverLink = () => {
  const navigate = useNavigate();

  return (
    <div className="become-driver-link">
      <span>Want to earn by driving?</span>
      <button onClick={() => navigate("/become-driver")}>
        Become a driver →
      </button>
    </div>
  );
};

export default BecomeDriverLink;
