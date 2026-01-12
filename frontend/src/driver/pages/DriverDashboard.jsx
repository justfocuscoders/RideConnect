import { useEffect, useState } from "react";
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

import "../styles/driverDashboard.css";

const DriverDashboard = () => {
  const [data, setData] = useState(null);
  const [rides, setRides] = useState([]);
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [earningsRange, setEarningsRange] = useState("7d");

  // STEP 9.9 — custom date range state
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Resolve start/end dates
  const { startDate, endDate } =
    earningsRange === "custom"
      ? customRange
      : getDateRangeFromSelection(earningsRange);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Guard: do not call API until both custom dates exist
      if (
        earningsRange === "custom" &&
        (!startDate || !endDate)
      ) {
        setEarningsData({ days: [] });
        setLoading(false);
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

      setData(overview);
      setRides(driverRides);

      // Transform backend response → chart/table format
      const chartData = {
        days: earnings.data.map((item) => ({
          date: item.period,
          total: item.earnings,
          rides: item.rides,
        })),
      };

      setEarningsData(chartData);
    } catch (err) {
      console.error("Driver dashboard load failed:", err);
      setError("We couldn’t load your dashboard right now.");
    } finally {
      setLoading(false);
    }
  };

  // Reload when range OR custom dates change
  useEffect(() => {
    loadDashboard();
  }, [earningsRange, customRange]);

  if (loading) return <DriverDashboardSkeleton />;

  if (error) {
    return (
      <DriverDashboardError
        message={error}
        onRetry={loadDashboard}
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
      <h1>Driver Dashboard</h1>
      <DriverOnlineToggle />

      <div className="kpi-grid">
        <DriverKPICard
          title="Total Rides"
          value={data.total_rides}
        />
        <DriverKPICard
          title="Completed Rides"
          value={data.completed_rides}
        />
        <DriverKPICard
          title="Total Earnings"
          value={`₹${data.total_earnings}`}
        />
        <DriverKPICard
          title="Today's Earnings"
          value={`₹${data.today_earnings}`}
        />
      </div>

      {/* STEP 9.9 — Range Selector + Custom Dates */}
      <EarningsRangeSelector
        value={earningsRange}
        onChange={setEarningsRange}
        customStart={customRange.startDate}
        customEnd={customRange.endDate}
        onCustomChange={setCustomRange}
      />

      {/* STEP 9.7 / 9.8 — Chart + Table */}
      <DriverEarningsChart data={earningsData} />
      <DriverEarningsTable data={earningsData} />

      {activeRide ? (
        <ActiveRidePanel
          ride={activeRide}
          onRefresh={loadDashboard}
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
