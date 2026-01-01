import { isProfileComplete } from "../../utils/profileUtils";

const RideActionsCard = ({ user }) => {
  const complete = isProfileComplete(user);

  return (
    <div className="card">
      <h3>Ride Actions</h3>

      <button disabled={!complete} className="btn">
        Create Ride
      </button>

      <button disabled={!complete} className="btn">
        Join Ride
      </button>

      {!complete && (
        <p className="hint-text">
          Complete your profile to enable ride actions.
        </p>
      )}
    </div>
  );
};

export default RideActionsCard;
