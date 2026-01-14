import { useAuth } from "../context/AuthContext";
import { MODES } from "../utils/mode";

const ModeSelector = () => {
  const { user, activeMode, switchMode } = useAuth();

  // Not logged in
  if (!user) return null;

  // Admin untouched
  if (user.role === "admin") return null;

  // Not a verified driver → no selector
  if (
    user.role !== "driver" ||
    user.driver_status !== "verified"
  ) {
    return null;
  }

  const handleChange = (e) => {
    switchMode(e.target.value);
  };

  return (
    <select
      value={activeMode}
      onChange={handleChange}
      style={{
        padding: "4px 8px",
        fontSize: "13px",
        borderRadius: "6px",
      }}
    >
      <option value={MODES.PASSENGER}>Passenger Mode</option>
      <option value={MODES.DRIVER}>Driver Mode</option>
    </select>
  );
};

export default ModeSelector;
