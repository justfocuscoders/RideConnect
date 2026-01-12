import RideActionButtons from "./RideActionButtons";

const ActiveRideCard = ({ ride, onRefresh }) => {
  if (!ride) return null;

  return (
    <div className="active-ride-card">
      <h2>Active Ride</h2>

      <div className="ride-info">
        <p><strong>Status:</strong> {ride.status}</p>
        <p><strong>Pickup:</strong> {ride.pickup_location}</p>
        <p><strong>Dropoff:</strong> {ride.dropoff_location}</p>
        <p><strong>Distance:</strong> {ride.distance_km} km</p>
        <p><strong>Fare:</strong> ₹{ride.fare_amount}</p>
      </div>

      <RideActionButtons
        ride={ride}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default ActiveRideCard;
