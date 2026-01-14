import { useEffect, useState } from "react";
import useAdminGuard from "../hooks/useAdminGuard";

import {
  getRevenueTotal,
  getRevenueDaily,
  getRideSummary,
  getDriverSummary,
  getPlatformEarnings,
} from "../services/adminAnalyticsApi";

import RevenueChart from "../components/RevenueChart";
import RideTrendChart from "../components/RideTrendChart";
import DriverEarningsChart from "../components/DriverEarningsChart";

export default function AdminDashboard() {
  useAdminGuard();

  // =========================
  // ADMIN INFO (HEADER)
  // =========================
  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setAdmin({
          name: parsed?.name || "Admin",
          email: parsed?.email || "",
        });
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // =========================
  // DASHBOARD STATE
  // =========================
  const [stats, setStats] = useState(null);
  const [revenueDaily, setRevenueDaily] = useState([]);
  const [platformEarnings, setPlatformEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ANALYTICS
  // =========================
  useEffect(() => {
    Promise.all([
      getRevenueTotal(),
      getRideSummary(),
      getDriverSummary(),
      getRevenueDaily(),
      getPlatformEarnings(),
    ])
      .then(
        ([
          revenueRes,
          ridesRes,
          driversRes,
          revenueDailyRes,
          platformEarningsRes,
        ]) => {
          setStats({
            revenue: revenueRes?.data || {},
            rides: ridesRes?.data || {},
            drivers: driversRes?.data || {},
          });

          setRevenueDaily(revenueDailyRes?.data || []);
          setPlatformEarnings(platformEarningsRes?.data || []);
        }
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading admin analytics…</div>;
  }

  return (
  <>
    {/* PAGE TITLE ONLY */}
    <h1 className="admin-title">Dashboard</h1>

    {/* KPI CARDS */}
    <div className="admin-cards">
      <div className="card revenue">
        <h4>Total Revenue</h4>
        <p>₹ {stats.revenue.total_revenue || 0}</p>
        <small>
          Total Payments: {stats.revenue.total_payments || 0}
        </small>
      </div>

      <div className="card rides">
        <h4>Total Rides</h4>
        <p>{stats.rides.total_rides || 0}</p>
      </div>

      <div className="card drivers">
        <h4>Total Drivers</h4>
        <p>{stats.drivers.total_drivers || 0}</p>
      </div>
    </div>

    {/* CHARTS */}
    <div className="charts-section">
      {revenueDaily.length > 0 ? (
        <>
          <RevenueChart data={revenueDaily} />
          <RideTrendChart data={revenueDaily} />
        </>
      ) : (
        <p>No revenue or ride trend data available.</p>
      )}

      {platformEarnings.length > 0 ? (
        <DriverEarningsChart data={platformEarnings} />
      ) : (
        <p>No platform earnings data available.</p>
      )}
    </div>
  </>
);

}
