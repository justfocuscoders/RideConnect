import axios from "../../services/api";

export const fetchDriverOverview = async () => {
  const res = await axios.get("/drivers/dashboard/overview");
  return res.data;
};
