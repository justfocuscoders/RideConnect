import { useEffect, useState } from "react";
import { fetchDriverRides } from "../api/driverRidesApi";
import DriverRidesTable from "../components/DriverRidesTable";
import EmptyState from "../components/EmptyState";


const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRides = async () => {
    try {
      setLoading(true);
      const data = await fetchDriverRides();
      setRides(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  if (loading) return <p>Loading rides...</p>;

  return (
  <div className="driver-rides">
    <h1>My Rides</h1>

    {rides.length === 0 ? (
      <EmptyState
        title="No rides yet"
        description="Your completed rides will appear here once you start driving."
      />
    ) : (
      <DriverRidesTable
        rides={rides}
        onActionComplete={loadRides}
      />
    )}
  </div>
);

};

export default DriverRides;
