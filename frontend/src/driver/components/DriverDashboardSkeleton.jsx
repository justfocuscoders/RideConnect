import "../styles/driverDashboardSkeleton.css";

const DriverDashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-kpis">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <div className="skeleton-active-ride" />
    </div>
  );
};

export default DriverDashboardSkeleton;
