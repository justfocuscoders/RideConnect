import api from "../../services/api";

/* =========================
   ADMIN ANALYTICS APIS
   ========================= */

export const getRevenueAnalytics = async () => {
  const res = await api.get("/admin/analytics/revenue");
  return res.data;
};

export const getRideTrends = async () => {
  const res = await api.get("/admin/analytics/rides");
  return res.data;
};

export const getDriverEarnings = async () => {
  const res = await api.get("/admin/analytics/driver-earnings");
  return res.data;
};
