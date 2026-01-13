import { useState } from "react";

import { fetchDriverOverview } from "../api/driverDashboardApi";
import { fetchDriverRides } from "../api/driverRidesApi";
import { fetchDriverEarningsDetails } from "../api/driverEarningsApi";

import DriverKPICard from "../components/DriverKPICard";
import ActiveRidePanel from "../components/ActiveRidePanel";
import DriverOnlineToggle from "../components/DriverOnlineToggle";
import DriverDashboardSkeleton from "../components/DriverDashboardSkeleton";
import DriverDashboardError from "../components/DriverDashboardError";
import DriverEarningsChart from "../components/DriverEarningsChart";
import DriverEarningsTable from "../components/DriverEarningsTable";
import EmptyState from "../components/EmptyState";
import EarningsRangeSelector from "../components/EarningsRangeSelector";

import { getDateRangeFromSelection } from "../../utils/earningsDateRange";
import usePolling from "../../hooks/usePolling";
import { useWebSocket } from "../../hooks/useWebSocket";

import "../styles/driverDashboard.css";

const DriverDashboard = () => {
  // ✅ STEP 9.12.2 — WebSocket (PASSIVE, NO UI MUTATION)
  useWebSocket();

  const [data, setData] = useState(null);
  const [rides, setRides] = useState([]);
  const [earningsData, setEarningsData] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [earningsRange, setEarningsRange] = useState("7d");

  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { startDate, endDate } =
    earningsRange === "custom"
      ? customRange
      : getDateRangeFromSelection(earningsRange);

  // ============================
  // CENTRALIZED FETCH (NO BLINK)
  // ============================
  const fetchDashboardData = async () => {
    const isInitialLoad = initialLoading;

    try {
      if (isInitialLoad) {
        setInitialLoading(true);
        setError(null);
      } else {
        setRefreshing(true);
      }

      if (
        earningsRange === "custom" &&
        (!startDate || !endDate)
      ) {
        return;
      }

      const [overview, driverRides, earnings] =
        await Promise.all([
          fetchDriverOverview(),
          fetchDriverRides(),
          fetchDriverEarningsDetails({
            startDate,
            endDate,
          }),
        ]);

      setData((prev) => prev ?? overview);
      setRides(driverRides);

      setEarningsData((prev) => {
        const next = earnings.data.map((item) => ({
          date: item.period,
          total: item.earnings,
          rides: item.rides,
        }));

        if (
          prev &&
          JSON.stringify(prev.days) === JSON.stringify(next)
        ) {
          return prev;
        }

        return { days: next };
      });
    } catch (err) {
      console.error("Driver dashboard load failed:", err);
      if (isInitialLoad) {
        setError("We couldn’t load your dashboard right now.");
      }
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  // ============================
  // STEP 9.11 — AUTO REFRESH
  // ============================
  usePolling(fetchDashboardData, 10000, true);

  // ============================
  // UI STATES
  // ============================
  if (initialLoading) return <DriverDashboardSkeleton />;

  if (error) {
    return (
      <DriverDashboardError
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  const activeRide = rides.find(
    (r) =>
      r.status === "accepted" ||
      r.status === "in_progress"
  );

  return (
    <div className="driver-dashboard">
      <div className="dashboard-header">
        <h1>Driver Dashboard</h1>
        {refreshing && (
          <span className="refresh-indicator">
            Updating…
          </span>
        )}
      </div>

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

      <EarningsRangeSelector
        value={earningsRange}
        onChange={setEarningsRange}
        customStart={customRange.startDate}
        customEnd={customRange.endDate}
        onCustomChange={setCustomRange}
      />

      <DriverEarningsChart data={earningsData} />
      <DriverEarningsTable data={earningsData} />

      {activeRide ? (
        <ActiveRidePanel
          ride={activeRide}
          onRefresh={fetchDashboardData}
        />
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
