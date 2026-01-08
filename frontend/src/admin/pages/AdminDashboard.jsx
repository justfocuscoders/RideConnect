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
          setStats({
            revenue: revenueRes.data,
            rides: ridesRes.data,
            drivers: driversRes.data,
          });

          setRevenueDaily(revenueDailyRes.data || []);
          setPlatformEarnings(platformEarningsRes.data || []);
        }
      )
      .catch(() => {
        setStats({ revenue: {}, rides: {}, drivers: {} });
        setRevenueDaily([]);
        setPlatformEarnings([]);
      });
  }, []);

  if (!stats) return <p>Loading admin analytics...</p>;

  return (
    <>
      {/* KPI CARDS */}
      <div className="admin-cards">
        <div className="card revenue">
          <h4>Total Revenue</h4>
          <p>₹ {stats.revenue.total_revenue}</p>
          <small>Total Payments: {stats.revenue.total_payments}</small>
        </div>

        <div className="card rides">
          <h4>Total Rides</h4>
          <p>{stats.rides.total_rides}</p>
        </div>

        <div className="card drivers">
          <h4>Total Drivers</h4>
          <p>{stats.drivers.total_drivers}</p>
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
