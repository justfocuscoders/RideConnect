import api from "../../services/api";

export const fetchDriverActiveRide = async () => {
  const response = await api.get("/dashboard/active-ride")

  return response.data;
};
