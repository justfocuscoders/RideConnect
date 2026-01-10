const EarningsSummaryCard = ({ title, value }) => {
  return (
    <div className="summary-card">
      <p className="summary-title">{title}</p>
      <h2 className="summary-value">{value}</h2>
    </div>
  );
};

export default EarningsSummaryCard;
