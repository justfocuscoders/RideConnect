import api from "../../services/api";

/**
 * Fetch all unassigned ride requests visible to drivers
 */
export const fetchAvailableRides = async () => {
  try {
    const { data } = await api.get("/drivers/rides/available");
    return data;
  } catch (error) {
    console.error("Failed to fetch available rides:", error);
    throw error;
  }
};

/**
 * Accept a ride as the current driver
 * @param {number} rideId
 */
export const acceptRide = async (rideId) => {
  try {
    const { data } = await api.post(`/drivers/rides/${rideId}/accept`);
    return data;
  } catch (error) {
    console.error("Failed to accept ride:", error);
    throw error;
  }
};
