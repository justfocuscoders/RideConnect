import { useEffect, useState } from "react";
import { fetchDriverEarnings } from "../api/driverEarningsApi";
import EarningsSummaryCard from "../components/EarningsSummaryCard";
import PaymentsTable from "../components/PaymentsTable";

const DriverEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverEarnings()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading earnings...</p>;

  return (
    <div className="driver-earnings">
      <h1>Earnings</h1>

      {/* SUMMARY */}
      <div className="earnings-summary">
        <EarningsSummaryCard title="Total Earnings" value={`₹${data.total_earnings}`} />
        <EarningsSummaryCard title="Commission" value={`₹${data.total_commission}`} />
        <EarningsSummaryCard title="Net Earnings" value={`₹${data.net_earnings}`} />
      </div>

      {/* PAYMENTS */}
      <PaymentsTable payments={data.payments} />
    </div>
  );
};

export default DriverEarnings;
