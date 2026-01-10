const statusColors = {
  ASSIGNED: "gray",
  ACCEPTED: "blue",
  STARTED: "orange",
  COMPLETED: "green",
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`status-badge ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
