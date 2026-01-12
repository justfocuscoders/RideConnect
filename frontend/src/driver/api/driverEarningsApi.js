import api from "../../services/api";

export const fetchDriverEarnings = async () => {
  const res = await api.get("/drivers/earnings");
  return res.data;
};

export const fetchDriverEarningsLast7Days = async () => {
  const response = await api.get("/drivers/earnings/last-7-days");
  return response.data;
};

