import { useEffect, useState } from "react";
import { fetchActiveRide } from "../api/activeRideApi";

const STATUS_UI = {
  requested: { label: "Finding driver", color: "#6b7280" },
  accepted: { label: "Driver accepted", color: "#2563eb" },
  arriving: { label: "Driver arriving", color: "#ea580c" },
  ongoing: { label: "Ride in progress", color: "#16a34a" },
};

const ActiveRideCard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const loadActiveRide = async () => {
    try {
      const res = await fetchActiveRide();
      setData(res);
      setError(null);
    } catch {
      setError("Unable to fetch active ride status");
    }
  };

  useEffect(() => {
    loadActiveRide();

    const interval = setInterval(loadActiveRide, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="card">
        <strong>{error}</strong>
      </div>
    );
  }

  if (!data || !data.has_active_ride) {
    return null;
  }

  const { ride } = data;
  const status = STATUS_UI[ride.status];

  return (
    <div className="card active-ride-card">
      <h3>Active Ride</h3>

      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: status?.color }}>
          {status?.label}
        </span>
      </p>

      <p>
        <strong>Pickup:</strong> {ride.pickup_location}
      </p>

      <p>
        <strong>Drop:</strong> {ride.drop_location}
      </p>

      <p>
        <strong>Fare:</strong> ₹{ride.fare_estimate}
      </p>

      {ride.driver?.name && (
        <p>
          <strong>Driver:</strong> {ride.driver.name}
        </p>
      )}
    </div>
  );
};

export default ActiveRideCard;
