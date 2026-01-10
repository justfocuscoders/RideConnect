const DriverKPICard = ({ title, value, icon, variant }) => {
  return (
    <div className={`kpi-card ${variant}`}>
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <p className="kpi-title">{title}</p>
      </div>
      <h2 className="kpi-value">{value}</h2>
    </div>
  );
};

export default DriverKPICard;
