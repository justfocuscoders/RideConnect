import "../styles/driverDashboardError.css";

const DriverDashboardError = ({ message, onRetry }) => {
  return (
    <div className="dashboard-error">
      <div className="error-card">
        <h2>⚠️ Something went wrong</h2>
        <p>{message}</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    </div>
  );
};

export default DriverDashboardError;
