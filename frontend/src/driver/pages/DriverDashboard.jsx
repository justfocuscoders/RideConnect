import { useState, useCallback, useEffect } from "react";

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
  // USER (FOR NAME DISPLAY)
  // ============================
  const [driverName, setDriverName] = useState("Driver");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setDriverName(parsed.name);
      } catch {
        /* ignore */
      }
    }
  }, []);

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ============================
  // VERIFICATION STATE
  // ============================
  const [verificationPending, setVerificationPending] = useState(false);

  // ============================
  // REALTIME — AVAILABLE RIDES
  // ============================
  const [availableRides, setAvailableRides] = useState([]);

  const handleSocketMessage = useCallback((payload) => {
    if (!payload?.event) return;

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

  // 🔐 WebSocket disabled when under verification
  useWebSocket(handleSocketMessage, !verificationPending);

  // ============================
  // DASHBOARD STATE
  // ============================
  const [overview, setOverview] = useState(null);
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
  // FETCH DASHBOARD DATA
  // ============================
  const fetchDashboardData = async () => {
    try {
      initialLoading ? setInitialLoading(true) : setRefreshing(true);
      setError(null);

      if (earningsRange === "custom" && (!startDate || !endDate)) return;

      const [overviewRes, ridesRes, earningsRes, openRides] =
        await Promise.all([
          fetchDriverOverview(),
          fetchDriverRides(),
          fetchDriverEarningsDetails({ startDate, endDate }),
          fetchAvailableRides(),
        ]);

      setOverview(overviewRes || null);
      setRides(Array.isArray(ridesRes) ? ridesRes : []);

      setAvailableRides((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        return [
          ...prev,
          ...(Array.isArray(openRides)
            ? openRides.filter((r) => !existingIds.has(r.id))
            : []),
        ];
      });

      if (earningsRes?.data) {
        setEarningsData({
          days: earningsRes.data.map((item) => ({
            date: item.period,
            total: item.earnings,
            rides: item.rides,
          })),
        });
      } else {
        setEarningsData(null);
      }
    } catch (err) {
      if (err?.response?.status === 403) {
        setVerificationPending(true);
        setError("Your driver account is under verification.");
      } else {
        setError("We couldn’t load your dashboard right now.");
      }
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  // ⏱ Polling disabled when verification pending
  usePolling(fetchDashboardData, 10000, !verificationPending);

  // ============================
  // UI STATES
  // ============================
  if (initialLoading) return <DriverDashboardSkeleton />;

  if (verificationPending) {
    return (
      <DriverDashboardError
        message="Your driver account is under verification. Please wait for admin approval."
        onRetry={null}
      />
    );
  }

  if (error) {
    return (
      <DriverDashboardError
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  if (!overview) {
    return (
      <DriverDashboardError
        message="Driver profile not ready yet."
        onRetry={fetchDashboardData}
      />
    );
  }

  const activeRide = rides.find((r) =>
    ["accepted", "arriving", "ongoing", "in_progress"].includes(r.status)
  );

  return (
    <div className="driver-dashboard">
      {/* ============================
          HEADER
         ============================ */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {driverName} 👋</h1>
          <p className="subtext">Driver Dashboard</p>
        </div>

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

                <button
                  onClick={async () => {
                    try {
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
            ))
          )}
        </>
      )}

      {/* ============================
          KPIs
         ============================ */}
      <div className="kpi-grid">
        <DriverKPICard title="Total Rides" value={overview.total_rides} />
        <DriverKPICard title="Completed Rides" value={overview.completed_rides} />
        <DriverKPICard
          title="Total Earnings"
          value={`₹${overview.total_earnings}`}
        />
        <DriverKPICard
          title="Today's Earnings"
          value={`₹${overview.today_earnings}`}
        />
      </div>

      <EarningsRangeSelector
        value={earningsRange}
        onChange={setEarningsRange}
        customStart={customRange.startDate}
        customEnd={customRange.endDate}
        onCustomChange={setCustomRange}
      />

      {earningsData && (
        <>
          <DriverEarningsChart data={earningsData} />
          <DriverEarningsTable data={earningsData} />
        </>
      )}

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
