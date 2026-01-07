import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function RideTrendsChart({ data }) {
  return (
    <div className="admin-card">
      <h3>Ride Trends</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_rides" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RideTrendsChart;
