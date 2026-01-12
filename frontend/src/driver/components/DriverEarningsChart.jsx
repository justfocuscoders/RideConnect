import EmptyState from "./EmptyState";
import "../styles/driverEarningsChart.css";

const DriverEarningsChart = ({ data }) => {
  if (!data || !data.days || data.days.length === 0) {
    return (
      <EmptyState
        title="No earnings data"
        description="Complete rides to see your earnings trend."
      />
    );
  }

  const max = Math.max(...data.days.map((d) => d.total), 1);

  return (
    <div className="earnings-chart">
      <h2>Earnings – Last 7 Days</h2>

      <div className="chart-bars">
        {data.days.map((day) => (
          <div key={day.date} className="chart-bar-wrapper">
            <div
              className="chart-bar"
              style={{
                height: `${(day.total / max) * 100}%`,
              }}
              title={`₹${day.total}`}
            />
            <span className="chart-label">
              {day.date.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverEarningsChart;
