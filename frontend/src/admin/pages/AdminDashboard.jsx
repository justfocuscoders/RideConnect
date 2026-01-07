import { useEffect, useState } from "react";
import useAdminGuard from "../hooks/useAdminGuard";
import AdminLayout from "../components/AdminLayout";

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

  const [stats, setStats] = useState(null);
  const [revenueDaily, setRevenueDaily] = useState([]);
  const [platformEarnings, setPlatformEarnings] = useState([]);

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
          // KPI stats (objects)
          setStats({
            revenue: revenueRes?.data || {},
            rides: ridesRes?.data || {},
            drivers: driversRes?.data || {},
          });

          // Charts (ALWAYS arrays)
          setRevenueDaily(
            Array.isArray(revenueDailyRes?.data)
              ? revenueDailyRes.data
              : []
          );

          setPlatformEarnings(
            Array.isArray(platformEarningsRes?.data)
              ? platformEarningsRes.data
              : []
          );
        }
      )
      .catch((err) => {
        console.error("Admin analytics load failed", err);
        setStats({
          revenue: {},
          rides: {},
          drivers: {},
        });
        setRevenueDaily([]);
        setPlatformEarnings([]);
      });
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <p>Loading admin analytics...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2>Admin Dashboard</h2>

      {/* =========================
          KPI CARDS
         ========================= */}
      <div className="admin-cards">
        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹ {stats.revenue.total_revenue ?? 0}</p>
          <small>
            Total Payments: {stats.revenue.total_payments ?? 0}
          </small>
        </div>

        <div className="card">
          <h4>Total Rides</h4>
          <p>{stats.rides.total_rides ?? 0}</p>
        </div>

        <div className="card">
          <h4>Total Drivers</h4>
          <p>{stats.drivers.total_drivers ?? 0}</p>
        </div>
      </div>

      {/* =========================
          ANALYTICS CHARTS
         ========================= */}

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
    </AdminLayout>
  );
}
