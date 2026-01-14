import api from "../../services/api";

export const fetchDriverActiveRide = async () => {
  const response = await api.get("/drivers/dashboard/active-ride");

  return response.data;
};
