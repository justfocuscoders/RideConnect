import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserDashboard.css";

import {
  getUserDashboardSummary,
  getUserRides,
  getUserPayments,
} from "../api/userDashboardApi";

import ActiveRideCard from "../components/ActiveRideCard";
import UserKpiCards from "../components/UserKpiCards";
import UserRidesTable from "../components/UserRidesTable";
import UserPaymentsTable from "../components/UserPaymentsTable";
import BecomeDriverLink from "../components/BecomeDriverLink";
import AnimatedSection from "../components/AnimatedSection";

import api from "../../services/api";
import usePolling from "../../hooks/usePolling";

const UserDashboard = () => {
  const navigate = useNavigate();

  // =====================
  // AUTH
  // =====================
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const role = payload?.role;
  const userName =
    payload?.name || payload?.full_name || payload?.email || "User";

  // =====================
  // DATA
  // =====================
  const [summary, setSummary] = useState(null);
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // =====================
  // BOOK RIDE FORM
  // =====================
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // =====================
  // FETCH DASHBOARD
  // =====================
  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const [s, r, p] = await Promise.all([
        getUserDashboardSummary(),
        getUserRides(),
        getUserPayments(),
      ]);
      setSummary(s);
      setRides(r);
      setPayments(p);
      setError(null);
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  usePolling(fetchDashboard, 10000, true);

  // =====================
  // CREATE RIDE
  // =====================
  const createRide = async (e) => {
    e.preventDefault();

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
      fetchDashboard();
    } catch {
      setCreateError("Failed to create ride");
    } finally {
      setCreating(false);
    }
  };

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (initialLoading) {
    return <div className="dashboard-loading">Loading dashboard…</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="user-dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>User Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome, <strong>{userName}</strong>
          </p>
        </div>

        <div className="header-actions">
          <span className="user-name">{userName}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {refreshing && <div className="refresh-indicator">Updating data…</div>}

      {/* ACTIVE RIDE */}
      <AnimatedSection delay={0}>
        <ActiveRideCard />
      </AnimatedSection>

      {/* BOOK RIDE */}
      <AnimatedSection delay={0.05}>
        <section className="dashboard-section primary-booking">
          <h2>Book a Ride</h2>
          <div className="dashboard-card booking-card">
            <form className="create-ride-form" onSubmit={createRide}>
              <input
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
              <input
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

              {createError && <p className="form-error">{createError}</p>}

              <button type="submit" disabled={creating}>
                {creating ? "Booking…" : "Book Ride"}
              </button>
            </form>
          </div>
        </section>
      </AnimatedSection>

      {/* KPI */}
      {summary && (
        <AnimatedSection delay={0.1}>
          <UserKpiCards summary={summary} />
        </AnimatedSection>
      )}

      {/* RIDES */}
      <AnimatedSection delay={0.15}>
        <section className="dashboard-section">
          <h2>Recent Rides</h2>
          <div className="dashboard-card">
            <UserRidesTable rides={rides} />
          </div>
        </section>
      </AnimatedSection>

      {/* PAYMENTS */}
      <AnimatedSection delay={0.2}>
        <section className="dashboard-section">
          <h2>Payments</h2>
          <div className="dashboard-card">
            <UserPaymentsTable payments={payments} />
          </div>
        </section>
      </AnimatedSection>

      {/* BECOME DRIVER */}
      {role === "user" && (
        <AnimatedSection delay={0.25}>
          <BecomeDriverLink />
        </AnimatedSection>
      )}
    </div>
  );
};

export default UserDashboard;
