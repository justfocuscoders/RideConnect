import { useEffect, useState } from "react";
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

const UserDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r, p] = await Promise.all([
          getUserDashboardSummary(),
          getUserRides(),
          getUserPayments(),
        ]);

        setSummary(s);
        setRides(r);
        setPayments(p);
      } catch (err) {
        console.warn("User dashboard load failed", err);
        setError("Failed to load dashboard data");
      }
    };

    load();
  }, []);

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!summary) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p className="dashboard-subtitle">
          Overview of your rides and payments
        </p>
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
