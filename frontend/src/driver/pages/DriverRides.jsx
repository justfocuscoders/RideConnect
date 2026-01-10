import { useEffect, useState } from "react";
import { fetchDriverRides } from "../api/driverRidesApi";
import DriverRidesTable from "../components/DriverRidesTable";

const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRides = async () => {
    setLoading(true);
    const data = await fetchDriverRides();
    setRides(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRides();
  }, []);

  if (loading) return <p>Loading rides...</p>;

  return (
    <div className="driver-rides">
      <h1>My Rides</h1>
      <DriverRidesTable rides={rides} onActionComplete={loadRides} />
    </div>
  );
};

export default DriverRides;
