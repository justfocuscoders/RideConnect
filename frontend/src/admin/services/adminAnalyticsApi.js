import api from "../../services/api";

// Revenue
export const getRevenueTotal = () =>
  api.get("/admin/analytics/revenue/total");

export const getRevenueDaily = () =>
  api.get("/admin/analytics/revenue/daily");

// Rides
export const getRideSummary = () =>
  api.get("/admin/analytics/rides/summary");

// Drivers
export const getDriverSummary = () =>
  api.get("/admin/analytics/drivers/summary");

// Platform
export const getPlatformEarnings = () =>
  api.get("/admin/analytics/platform/earnings");
