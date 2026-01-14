import api from "../../services/api";

export const fetchDriverOverview = async () => {
  const res = await api.get("/dashboard/overview");
  return res.data;
};

export const fetchDriverActiveRide = async () => {
  const res = await api.get("/dashboard/active-ride");
  return res.data;
};
