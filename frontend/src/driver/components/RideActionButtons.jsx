import {
  acceptRide,
  startRide,
  completeRide,
} from "../api/driverRidesApi";

const RideActionButtons = ({ ride, onSuccess }) => {
  const handleAction = async (actionFn) => {
    await actionFn(ride.ride_id);
    onSuccess();
  };

  switch (ride.status) {
    case "ASSIGNED":
      return (
        <button onClick={() => handleAction(acceptRide)}>
          Accept
        </button>
      );

    case "ACCEPTED":
      return (
        <button onClick={() => handleAction(startRide)}>
          Start Ride
        </button>
      );

    case "STARTED":
      return (
        <button onClick={() => handleAction(completeRide)}>
          Complete Ride
        </button>
      );

    default:
      return <span>—</span>;
  }
};

export default RideActionButtons;
