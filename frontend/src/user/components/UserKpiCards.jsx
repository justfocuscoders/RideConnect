import "../css/UserKpiCards.css";

const UserKpiCards = ({ summary }) => {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-label">Total Rides</span>
        <span className="kpi-value">{summary.total_rides}</span>
      </div>

      <div className="kpi-card">
        <span className="kpi-label">Completed</span>
        <span className="kpi-value">{summary.completed_rides}</span>
      </div>

      <div className="kpi-card">
        <span className="kpi-label">Cancelled</span>
        <span className="kpi-value">{summary.cancelled_rides}</span>
      </div>

      <div className="kpi-card highlight">
        <span className="kpi-label">Total Spent</span>
        <span className="kpi-value">₹{summary.total_spent}</span>
      </div>
    </div>
  );
};

export default UserKpiCards;
