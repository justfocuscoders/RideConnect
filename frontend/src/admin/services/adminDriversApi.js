import axios from "../../services/api";

// GET /admin/drivers
export const getAllDrivers = () => {
  return axios.get("/admin/drivers");
};

// PATCH /admin/drivers/{id}/verify
export const verifyDriver = (driverId) => {
  return axios.patch(`/admin/drivers/${driverId}/verify`);
};
