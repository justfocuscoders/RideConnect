import { useEffect, useState } from "react";
import useAdminGuard from "../hooks/useAdminGuard";
import AdminLayout from "../components/AdminLayout";
import {
  getRevenueTotal,
  getRideSummary,
  getDriverSummary,
} from "../services/adminAnalyticsApi";

export default function AdminDashboard() {
  useAdminGuard();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      getRevenueTotal(),
      getRideSummary(),
      getDriverSummary(),
    ]).then(([revenue, rides, drivers]) => {
      setStats({
        revenue: revenue.data,
        rides: rides.data,
        drivers: drivers.data,
      });
    });
  }, []);

  if (!stats) return <p>Loading admin analytics...</p>;

  return (
    <AdminLayout>
      <h2>Admin Dashboard</h2>

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
    </AdminLayout>
  );
}
