import { useState } from "react";
import {
  acceptRide,
  startRide,
  completeRide,
} from "../api/driverRideApi";

const DriverRideActions = ({ ride, onRideUpdate, disabled }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionFn) => {
    try {
      setLoading(true);
      const res = await actionFn(ride.id);
      onRideUpdate(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  if (ride.status === "requested") {
    return (
      <button
        disabled={loading || disabled}
        onClick={() => handleAction(acceptRide)}
      >
        Accept Ride
      </button>
    );
  }

  if (ride.status === "accepted") {
    return (
      <button
        disabled={loading}
        onClick={() => handleAction(startRide)}
      >
        Start Ride
      </button>
    );
  }

  if (ride.status === "in_progress") {
    return (
      <button
        disabled={loading}
        onClick={() => handleAction(completeRide)}
      >
        Complete Ride
      </button>
    );
  }

  return null;
};

export default DriverRideActions;
