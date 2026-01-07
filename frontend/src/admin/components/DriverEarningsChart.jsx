import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function DriverEarningsChart({ data }) {
  return (
    <div className="admin-card">
      <h3>Driver Earnings</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="driver_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_earnings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DriverEarningsChart;
