import {
  acceptRide,
  startRide,
  completeRide,
} from "../api/driverRidesApi";

const RideActionButtons = ({
  ride,
  disableAccept = false,
  onSuccess,
}) => {
  const handleAction = async (actionFn) => {
    try {
      await actionFn(ride.id);
      onSuccess();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Ride action failed"
      );
    }
  };

  switch (ride.status) {
    case "requested":
      return (
        <button
          disabled={disableAccept}
          onClick={() => handleAction(acceptRide)}
        >
          Accept
        </button>
      );

    case "accepted":
      return (
        <button
          onClick={() => handleAction(startRide)}
        >
          Start Ride
        </button>
      );

    case "in_progress":
      return (
        <button
          onClick={() => handleAction(completeRide)}
        >
          Complete Ride
        </button>
      );

    default:
      return <span>—</span>;
  }
};

export default RideActionButtons;
