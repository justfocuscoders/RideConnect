import EmptyState from "./EmptyState";
import "../styles/driverEarningsChart.css";

const DriverEarningsChart = ({ data }) => {
  const isEmpty = !data || !data.days || data.days.length === 0;

  const days = isEmpty
    ? Array.from({ length: 7 }).map((_, i) => ({
        date: `2026-01-${String(i + 1).padStart(2, "0")}`,
        total: 0,
      }))
    : data.days;

  const max = Math.max(...days.map((d) => d.total), 1);

  return (
    <div className="earnings-chart">
      <h2>Earnings – Last 7 Days</h2>

      <div className="chart-bars">
        {days.map((day) => (
          <div key={day.date} className="chart-bar-wrapper">
            <div
              className="chart-bar"
              style={{
                height: `${(day.total / max) * 100}%`,
                opacity: isEmpty ? 0.4 : 1,
              }}
              title={`₹${day.total}`}
            />
            <span className="chart-label">
              {day.date.slice(5)}
            </span>
          </div>
        ))}
      </div>

      {isEmpty && (
        <div className="chart-empty-hint">
          Earnings will appear here once you complete rides.
        </div>
      )}
    </div>
  );
};

export default DriverEarningsChart;
