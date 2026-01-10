import { useEffect, useState } from "react";
import {
  getDriverStatus,
  updateDriverStatus,
} from "../api/driverStatusApi";

const DriverOnlineToggle = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverStatus()
      .then((data) => setIsOnline(data.is_online))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus); // optimistic update
    await updateDriverStatus(newStatus);
  };

  if (loading) return <p>Loading status...</p>;

  return (
    <div className="driver-status-toggle">
      <span>Status:</span>
      <button
        onClick={handleToggle}
        className={isOnline ? "online" : "offline"}
      >
        {isOnline ? "ONLINE" : "OFFLINE"}
      </button>
    </div>
  );
};

export default DriverOnlineToggle;
