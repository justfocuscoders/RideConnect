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
            revenue: revenueRes?.data || {},
            rides: ridesRes?.data || {},
            drivers: driversRes?.data || {},
          });

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
      .catch(() => {
        setStats({ revenue: {}, rides: {}, drivers: {} });
        setRevenueDaily([]);
        setPlatformEarnings([]);
      });
  }, []);

  if (!stats) {
    return <p className="admin-loading">Loading admin analytics...</p>;
  }

  return (
    <>
      

      {/* KPI CARDS */}
      <div className="admin-cards">
        <div className="card revenue">
          <h4>Total Revenue</h4>
          <p>₹ {stats.revenue.total_revenue ?? 0}</p>
          <small>Total Payments: {stats.revenue.total_payments ?? 0}</small>
        </div>

        <div className="card rides">
          <h4>Total Rides</h4>
          <p>{stats.rides.total_rides ?? 0}</p>
        </div>

        <div className="card drivers">
          <h4>Total Drivers</h4>
          <p>{stats.drivers.total_drivers ?? 0}</p>
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
          <p className="admin-empty">
            No revenue or ride trend data available.
          </p>
        )}

        {platformEarnings.length > 0 ? (
          <DriverEarningsChart data={platformEarnings} />
        ) : (
          <p className="admin-empty">
            No platform earnings data available.
          </p>
        )}
      </div>
    </>
  );
}
