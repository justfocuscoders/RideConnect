import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function RevenueChart({ data }) {
  return (
    <div className="admin-card">
      <h3>Revenue Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_revenue" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
