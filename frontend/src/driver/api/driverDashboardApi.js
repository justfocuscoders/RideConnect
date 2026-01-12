import api from "../../services/api";

export const fetchDriverOverview = async () => {
  const res = await api.get("/drivers/dashboard/overview");
  return res.data;
};
