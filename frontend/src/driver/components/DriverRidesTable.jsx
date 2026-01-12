import DriverRideRow from "./DriverRideRow";

const DriverRidesTable = ({ rides, onActionComplete }) => {
  if (!rides.length) {
    return <p>No rides assigned yet.</p>;
  }

  const hasActiveRide = rides.some((r) =>
    ["accepted", "in_progress"].includes(r.status)
  );

  return (
    <table className="rides-table">
      <thead>
        <tr>
          <th>Ride ID</th>
          <th>Rider</th>
          <th>Route</th>
          <th>Fare</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {rides.map((ride) => (
          <DriverRideRow
            key={ride.id}
            ride={ride}
            hasActiveRide={hasActiveRide}
            onActionComplete={onActionComplete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default DriverRidesTable;
