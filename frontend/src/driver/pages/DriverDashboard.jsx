import { useEffect, useState } from "react";
import { fetchDriverOverview } from "../api/driverDashboardApi";
import { fetchDriverRides } from "../api/driverRidesApi";
import { fetchDriverEarningsLast7Days } from "../api/driverEarningsApi";

import DriverKPICard from "../components/DriverKPICard";
import ActiveRidePanel from "../components/ActiveRidePanel";
import DriverOnlineToggle from "../components/DriverOnlineToggle";
import DriverDashboardSkeleton from "../components/DriverDashboardSkeleton";
import DriverDashboardError from "../components/DriverDashboardError";
import DriverEarningsChart from "../components/DriverEarningsChart";
import EmptyState from "../components/EmptyState";

import "../styles/driverDashboard.css";

const DriverDashboard = () => {
  const [data, setData] = useState(null);
  const [rides, setRides] = useState([]);
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overview, driverRides, earnings] = await Promise.all([
        fetchDriverOverview(),
        fetchDriverRides(),
        fetchDriverEarningsLast7Days(),
      ]);

      setData(overview);
      setRides(driverRides);
      setEarningsData(earnings);
    } catch (err) {
      console.error("Driver dashboard load failed:", err);
      setError("We couldn’t load your dashboard right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <DriverDashboardSkeleton />;

  if (error)
    return (
      <DriverDashboardError
        message={error}
        onRetry={loadDashboard}
      />
    );

  const activeRide = rides.find(
    (r) => r.status === "accepted" || r.status === "in_progress"
  );

  return (
    <div className="driver-dashboard">
      <h1>Driver Dashboard</h1>
      <DriverOnlineToggle />

      <div className="kpi-grid">
        <DriverKPICard title="Total Rides" value={data.total_rides} />
        <DriverKPICard title="Completed Rides" value={data.completed_rides} />
        <DriverKPICard
          title="Total Earnings"
          value={`₹${data.total_earnings}`}
        />
        <DriverKPICard
          title="Today's Earnings"
          value={`₹${data.today_earnings}`}
        />
      </div>

      {/* ✅ STEP 9.6 — Earnings Chart */}
      <DriverEarningsChart data={earningsData} />

      {activeRide ? (
        <ActiveRidePanel ride={activeRide} onRefresh={loadDashboard} />
      ) : (
        <EmptyState
          title="No active ride"
          description="Accept a ride request to start driving."
        />
      )}
    </div>
  );
};

export default DriverDashboard;
