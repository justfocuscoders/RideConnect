import api from "../../services/api";

// Fetch all rides assigned to the driver
export const fetchDriverRides = async () => {
  const res = await api.get("/drivers/rides");
  return res.data;
};

// Accept a ride
export const acceptRide = (rideId) => {
  return api.patch(`/drivers/rides/${rideId}/accept`);
};

// Start a ride
export const startRide = (rideId) => {
  return api.patch(`/drivers/rides/${rideId}/start`);
};

// Complete a ride
export const completeRide = (rideId) => {
  return api.patch(`/drivers/rides/${rideId}/complete`);
};
