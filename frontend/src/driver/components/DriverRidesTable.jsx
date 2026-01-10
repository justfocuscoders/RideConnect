import RideActionButtons from "./RideActionButtons";
import StatusBadge from "./StatusBadge";

const DriverRidesTable = ({ rides, onActionComplete }) => {
  if (!rides.length) {
    return <p>No rides assigned yet.</p>;
  }

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
          <tr key={ride.ride_id}>
            <td>{ride.ride_id}</td>
            <td>{ride.rider_name}</td>
            <td>
              {ride.pickup_location} → {ride.drop_location}
            </td>
            <td>₹{ride.fare}</td>
            <td>
              <StatusBadge status={ride.status} />
            </td>
            <td>
              <RideActionButtons
                ride={ride}
                onSuccess={onActionComplete}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DriverRidesTable;
