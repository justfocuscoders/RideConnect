import { useEffect, useState } from "react";
import { fetchDriverOverview } from "../api/driverDashboardApi";
import DriverKPICard from "../components/DriverKPICard";
import ActiveRidePanel from "../components/ActiveRidePanel";
import "../styles/driverDashboard.css";
import DriverOnlineToggle from "../components/DriverOnlineToggle";



const DriverDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverOverview()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
if (!data) return <p>Unable to load dashboard data.</p>;

  return (
    
    <div className="driver-dashboard">
      <h1>Driver Dashboard</h1>
      <DriverOnlineToggle />

      

      {/* KPI GRID */}
      <div className="kpi-grid">
        <DriverKPICard
  title="Total Rides"
  value={data.total_rides}
  icon="🚗"
  variant="primary"
/>

<DriverKPICard
  title="Completed Rides"
  value={data.completed_rides}
  icon="✅"
  variant="success"
/>

<DriverKPICard
  title="Total Earnings"
  value={`₹${data.total_earnings}`}
  icon="💰"
  variant="earnings"
/>

<DriverKPICard
  title="Today's Earnings"
  value={`₹${data.today_earnings}`}
  icon="📅"
  variant="today"
/>


      </div>

      {/* ACTIVE RIDE */}
      <ActiveRidePanel />
    </div>
  );
};

export default DriverDashboard;
