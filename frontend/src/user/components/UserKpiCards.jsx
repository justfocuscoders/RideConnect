const UserKpiCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">Total Rides: {summary.total_rides}</div>
      <div className="card">Completed: {summary.completed_rides}</div>
      <div className="card">Cancelled: {summary.cancelled_rides}</div>
      <div className="card">Total Spent: ₹{summary.total_spent}</div>
    </div>
  );
};

export default UserKpiCards;
