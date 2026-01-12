import RideActionButtons from "./RideActionButtons";
import StatusBadge from "./StatusBadge";

const DriverRideRow = ({
  ride,
  hasActiveRide,
  onActionComplete,
}) => {
  const disableAccept =
    hasActiveRide && ride.status === "requested";

  return (
    <tr>
      <td>{ride.id}</td>

      <td>{ride.rider_name}</td>

      <td>
        {ride.pickup_location} → {ride.dropoff_location}
      </td>

      <td>₹{ride.fare}</td>

      <td>
        <StatusBadge status={ride.status} />
      </td>

      <td>
        <RideActionButtons
          ride={ride}
          disableAccept={disableAccept}
          onSuccess={onActionComplete}
        />
      </td>
    </tr>
  );
};

export default DriverRideRow;
