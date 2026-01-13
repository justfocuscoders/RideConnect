import { useState, useCallback } from "react";

import { fetchDriverOverview } from "../api/driverDashboardApi";
import { fetchDriverRides } from "../api/driverRidesApi";
import { fetchDriverEarningsDetails } from "../api/driverEarningsApi";
import {
  fetchAvailableRides,
  acceptRide,
} from "../api/driverAvailableRidesApi";

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
  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ============================
  // REALTIME — AVAILABLE RIDES
  // ============================
  const [availableRides, setAvailableRides] = useState([]);

  const handleSocketMessage = useCallback((payload) => {
    switch (payload.event) {
      case "ride_created":
        setAvailableRides((prev) => {
          if (prev.some((r) => r.id === payload.data.id)) return prev;
          return [payload.data, ...prev];
        });
        break;

      case "ride_accepted":
        setAvailableRides((prev) =>
          prev.filter((r) => r.id !== payload.data.ride_id)
        );
        break;

      default:
        break;
    }
  }, []);

  useWebSocket(handleSocketMessage);

  // ============================
  // DASHBOARD STATE
  // ============================
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
  // CENTRALIZED FETCH
  // ============================
  const fetchDashboardData = async () => {
    try {
      initialLoading ? setInitialLoading(true) : setRefreshing(true);
      setError(null);

      if (earningsRange === "custom" && (!startDate || !endDate)) return;

      const [
        overview,
        driverRides,
        earnings,
        openRides,
      ] = await Promise.all([
        fetchDriverOverview(),
        fetchDriverRides(),
        fetchDriverEarningsDetails({ startDate, endDate }),
        fetchAvailableRides(),
      ]);

      setData(overview);
      setRides(driverRides);

      // Merge polling + websocket safely
      setAvailableRides((prev) => {
        const ids = new Set(prev.map((r) => r.id));
        return [...prev, ...openRides.filter((r) => !ids.has(r.id))];
      });

      setEarningsData({
        days: earnings.data.map((item) => ({
          date: item.period,
          total: item.earnings,
          rides: item.rides,
        })),
      });
    } catch (err) {
      console.error("Driver dashboard load failed:", err);
      if (initialLoading) {
        setError("We couldn’t load your dashboard right now.");
      }
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  // ============================
  // AUTO REFRESH
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
    (r) => r.status === "accepted" || r.status === "in_progress"
  );

  return (
    <div className="driver-dashboard">
      {/* ============================
          HEADER + LOGOUT
         ============================ */}
      <div className="dashboard-header">
        <h1>Driver Dashboard</h1>

        <div className="header-actions">
          {refreshing && (
            <span className="refresh-indicator">Updating…</span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <DriverOnlineToggle />

      {/* ============================
          AVAILABLE RIDES
         ============================ */}
      {!activeRide && (
        <>
          <h3>Available Rides</h3>

          {availableRides.length === 0 ? (
            <EmptyState
              title="No ride requests"
              description="Waiting for users to request rides."
            />
          ) : (
            availableRides.map((ride) => (
              <div key={ride.id} className="ride-card">
                <p><strong>Pickup:</strong> {ride.pickup_location}</p>
                <p><strong>Drop:</strong> {ride.drop_location}</p>
                <p><strong>Distance:</strong> {ride.distance_km} km</p>
                <p><strong>Fare:</strong> ₹{ride.estimated_fare}</p>

                <div className="actions">
                  <button
                    onClick={async () => {
                      try {
                        // Optimistic UI
                        setAvailableRides((prev) =>
                          prev.filter((r) => r.id !== ride.id)
                        );
                        await acceptRide(ride.id);
                        fetchDashboardData();
                      } catch {
                        alert("Ride already taken");
                        fetchDashboardData();
                      }
                    }}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ============================
          KPIs
         ============================ */}
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

      {activeRide && (
        <ActiveRidePanel
          ride={activeRide}
          onRefresh={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
