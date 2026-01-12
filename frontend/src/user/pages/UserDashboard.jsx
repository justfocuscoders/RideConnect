import { useState } from "react";
import "../css/UserDashboard.css";

import {
  getUserDashboardSummary,
  getUserRides,
  getUserPayments,
} from "../api/userDashboardApi";

import UserKpiCards from "../components/UserKpiCards";
import UserRidesTable from "../components/UserRidesTable";
import UserPaymentsTable from "../components/UserPaymentsTable";
import ActiveRideCard from "../components/ActiveRideCard";

import usePolling from "../../hooks/usePolling";

const UserDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);

  // ✅ split loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ============================
  // CENTRALIZED FETCH (NO BLINK)
  // ============================
  const fetchUserDashboardData = async () => {
    const isInitialLoad = initialLoading;

    try {
      if (isInitialLoad) {
        setInitialLoading(true);
        setError(null);
      } else {
        setRefreshing(true); // silent refresh
      }

      const [s, r, p] = await Promise.all([
        getUserDashboardSummary(),
        getUserRides(),
        getUserPayments(),
      ]);

      // Never clear existing data during refresh
      setSummary((prev) => prev ?? s);
      setRides(r);
      setPayments(p);
    } catch (err) {
      console.warn("User dashboard load failed", err);
      if (isInitialLoad) {
        setError("Failed to load dashboard data");
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
  usePolling(fetchUserDashboardData, 10000, true);

  // ============================
  // UI STATES
  // ============================
  if (initialLoading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p className="dashboard-subtitle">
          Overview of your rides and payments
        </p>

        {/* subtle refresh indicator (no layout shift) */}
        <span className="refresh-indicator">
          {refreshing ? "Updating…" : ""}
        </span>
      </div>

      {/* ACTIVE RIDE */}
      <ActiveRideCard />

      {/* KPI GRID */}
      <UserKpiCards summary={summary} />

      {/* RIDES */}
      <div className="dashboard-section">
        <h2>Recent Rides</h2>
        <div className="dashboard-card">
          <UserRidesTable rides={rides} />
        </div>
      </div>

      {/* PAYMENTS */}
      <div className="dashboard-section">
        <h2>Payments</h2>
        <div className="dashboard-card">
          <UserPaymentsTable payments={payments} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
