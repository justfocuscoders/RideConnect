import { useEffect, useState } from "react";
import useAdminGuard from "../hooks/useAdminGuard";
import AdminLayout from "../components/AdminLayout";

import {
  getRevenueTotal,
  getRideSummary,
  getDriverSummary,
  getRevenueTrend,
  getRideTrend,
  getDriverEarningsTrend,
} from "../services/adminAnalyticsApi";

import RevenueChart from "../components/RevenueChart";
import RideTrendChart from "../components/RideTrendChart";
import DriverEarningsChart from "../components/DriverEarningsChart";

export default function AdminDashboard() {
  useAdminGuard();

  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [rideTrend, setRideTrend] = useState([]);
  const [driverEarnings, setDriverEarnings] = useState([]);

  useEffect(() => {
    Promise.all([
      getRevenueTotal(),
      getRideSummary(),
      getDriverSummary(),
      getRevenueTrend(),
      getRideTrend(),
      getDriverEarningsTrend(),
    ]).then(
      ([
        revenue,
        rides,
        drivers,
        revenueTrendRes,
        rideTrendRes,
        earningsRes,
      ]) => {
        setStats({
          revenue: revenue.data,
          rides: rides.data,
          drivers: drivers.data,
        });

        setRevenueTrend(revenueTrendRes.data);
        setRideTrend(rideTrendRes.data);
        setDriverEarnings(earningsRes.data);
      }
    );
  }, []);

  if (!stats) return <p>Loading admin analytics...</p>;

  return (
    <AdminLayout>
      <h2>Admin Dashboard</h2>

      {/* KPI CARDS — unchanged */}
      <div className="admin-cards">
        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹ {stats.revenue.total}</p>
        </div>

        <div className="card">
          <h4>Total Rides</h4>
          <p>{stats.rides.total_rides}</p>
        </div>

        <div className="card">
          <h4>Total Drivers</h4>
          <p>{stats.drivers.total_drivers}</p>
        </div>
      </div>

      {/* CHARTS — STEP 7.2 ADDITION */}
      <RevenueChart data={revenueTrend} />
      <RideTrendChart data={rideTrend} />
      <DriverEarningsChart data={driverEarnings} />
    </AdminLayout>
  );
}
