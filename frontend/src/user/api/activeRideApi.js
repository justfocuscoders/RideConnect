import api from "../../services/api";

/**
 * Fetch currently active ride for logged-in user
 */
export const fetchActiveRide = async () => {
  const response = await api.get("/users/dashboard/active-ride");
  return response.data;
};
