import { useEffect, useState } from "react";
import { fetchActiveRide } from "../api/activeRideApi";

const STATUS_UI = {
  requested: "Finding driver",
  accepted: "Driver accepted",
  arriving: "Driver arriving",
  ongoing: "Ride in progress",
};

const ActiveRideCard = () => {
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      const res = await fetchActiveRide();
      setData(res);
    } catch {
      setData(null);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  if (!data || !data.has_active_ride) {
    return (
      <section className="dashboard-section">
        <div className="dashboard-card active-ride-card empty">
          <h3>Active Ride</h3>
          <p>No active ride right now.</p>
        </div>
      </section>
    );
  }

  const { ride } = data;

  return (
    <section className="dashboard-section">
      <div className="dashboard-card active-ride-card">
        <h3>Active Ride</h3>
        <p><strong>Status:</strong> {STATUS_UI[ride.status]}</p>
        <p><strong>Pickup:</strong> {ride.pickup_location}</p>
        <p><strong>Drop:</strong> {ride.drop_location}</p>
        <p><strong>Fare:</strong> ₹{ride.fare_estimate}</p>
        {ride.driver?.name && (
          <p><strong>Driver:</strong> {ride.driver.name}</p>
        )}
      </div>
    </section>
  );
};

export default ActiveRideCard;
