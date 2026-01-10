import axios from "../../utils/axios";

export const fetchDriverRides = async () => {
  const res = await axios.get("/drivers/rides");
  return res.data;
};

export const acceptRide = (id) =>
  axios.patch(`/drivers/rides/${id}/accept`);

export const startRide = (id) =>
  axios.patch(`/drivers/rides/${id}/start`);

export const completeRide = (id) =>
  axios.patch(`/drivers/rides/${id}/complete`);
