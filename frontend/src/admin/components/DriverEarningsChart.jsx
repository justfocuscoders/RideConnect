import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DriverEarningsChart({ data }) {
  return (
    <div className="chart-box">
      <h3>Platform Earnings</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="platform_earnings" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
