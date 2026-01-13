import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserDashboard.css";

import api from "../../services/api";

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
  const navigate = useNavigate();

  // ============================
  // DASHBOARD DATA
  // ============================
  const [summary, setSummary] = useState(null);
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ============================
  // CREATE RIDE FORM
  // ============================
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // ============================
  // FETCH DASHBOARD DATA
  // ============================
  const fetchUserDashboardData = async () => {
    const isInitial = initialLoading;

    try {
      if (isInitial) {
        setError(null);
      } else {
        setRefreshing(true);
      }

      const [s, r, p] = await Promise.all([
        getUserDashboardSummary(),
        getUserRides(),
        getUserPayments(),
      ]);

      setSummary(s);
      setRides(r);
      setPayments(p);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      if (isInitial) {
        setError("Failed to load dashboard data");
      }
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  usePolling(fetchUserDashboardData, 10000, true);

  // ============================
  // CREATE RIDE
  // ============================
  const createRide = async () => {
    if (!pickup || !drop || !distance) {
      setCreateError("All fields are required");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      await api.post("/rides", {
        pickup_location: pickup,
        drop_location: drop,
        distance_km: Number(distance),
      });

      setPickup("");
      setDrop("");
      setDistance("");

      fetchUserDashboardData();
    } catch (err) {
      console.error("Ride creation failed", err);
      setCreateError("Failed to create ride");
    } finally {
      setCreating(false);
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ============================
  // UI STATES
  // ============================
  if (initialLoading) {
    return <div className="dashboard-loading">Loading dashboard…</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="user-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-header-row">
          <div>
            <h1>User Dashboard</h1>
            <p className="dashboard-subtitle">
              Overview of your rides and payments
            </p>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <span className="refresh-indicator">
          {refreshing ? "Updating…" : ""}
        </span>
      </div>

      {/* ============================
          BOOK RIDE
         ============================ */}
      <div className="dashboard-section">
        <h2>Book a Ride</h2>
        <div className="dashboard-card">
          <form
            className="create-ride-form"
            onSubmit={(e) => {
              e.preventDefault(); // ✅ prevents page refresh
              createRide();
            }}
          >
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Drop location"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Distance (km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />

            {createError && (
              <p className="form-error">{createError}</p>
            )}

            <button type="submit" disabled={creating}>
              {creating ? "Booking…" : "Book Ride"}
            </button>
          </form>
        </div>
      </div>

      {/* ACTIVE RIDE */}
      <ActiveRideCard />

      {/* KPI */}
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
