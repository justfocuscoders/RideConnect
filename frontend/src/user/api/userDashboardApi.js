import axios from "../../services/api";

export const getUserDashboardSummary = async () => {
  const res = await axios.get("/users/dashboard/summary");
  return res.data;
};

export const getUserRides = async () => {
  const res = await axios.get("/users/dashboard/rides");
  return res.data;
};

export const getUserPayments = async () => {
  const res = await axios.get("/users/dashboard/payments");
  return res.data;
};
