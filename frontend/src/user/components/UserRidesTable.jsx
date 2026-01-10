const UserRidesTable = ({ rides }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Pickup</th>
          <th>Dropoff</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rides.map((ride) => (
          <tr key={ride.id}>
            <td>{ride.id}</td>
            <td>{ride.status}</td>
            <td>{ride.pickup_location}</td>
            <td>{ride.dropoff_location || "-"}</td>
            <td>{new Date(ride.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserRidesTable;
