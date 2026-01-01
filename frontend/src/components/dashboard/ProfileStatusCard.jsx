import { Link } from "react-router-dom";
import { isProfileComplete } from "../../utils/profileUtils";

const ProfileStatusCard = ({ user }) => {
  const complete = isProfileComplete(user);

  return (
    <div className="card">
      <h3>Profile Status</h3>

      {complete ? (
        <p className="success-text">Your profile is complete.</p>
      ) : (
        <>
          <p className="warning-text">
            Please complete your profile to access ride features.
          </p>
          <Link to="/profile" className="btn btn-primary">
            Complete Profile
          </Link>
        </>
      )}
    </div>
  );
};

export default ProfileStatusCard;
