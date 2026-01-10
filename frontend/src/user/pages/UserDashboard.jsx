import { useEffect, useState } from "react";
import useUserGuard from "../hooks/useUserGuard";
import {
  getUserDashboardSummary,
  getUserRides,
  getUserPayments,
} from "../api/userDashboardApi";

import UserKpiCards from "../components/UserKpiCards";
import UserRidesTable from "../components/UserRidesTable";
import UserPaymentsTable from "../components/UserPaymentsTable";

const UserDashboard = () => {
  useUserGuard();

  const [summary, setSummary] = useState(null);
  const [rides, setRides] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getUserDashboardSummary().then(setSummary);
    getUserRides().then(setRides);
    getUserPayments().then(setPayments);
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Dashboard</h1>

      <UserKpiCards summary={summary} />

      <h2>Recent Rides</h2>
      <UserRidesTable rides={rides} />

      <h2>Payments</h2>
      <UserPaymentsTable payments={payments} />
    </div>
  );
};

export default UserDashboard;
