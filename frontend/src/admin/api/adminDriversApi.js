import axios from "../../services/api";

export const fetchAdminDrivers = async () => {
  const res = await axios.get("/admin/drivers");
  return res.data;
};

export const verifyAdminDriver = async (driverId) => {
  const res = await axios.patch(`/admin/drivers/${driverId}/verify`);
  return res.data;
};
