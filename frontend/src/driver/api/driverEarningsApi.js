import api from "../../services/api";

export const fetchDriverEarnings = async () => {
  const res = await api.get("/earnings")

  return res.data;
};

export const fetchDriverEarningsLast7Days = async () => {
  const response = await api.get("/drivers/earnings/last-7-days");
  return response.data;
};

// STEP 9.7 — Range-based earnings
export const fetchDriverEarningsDetails = async ({
  startDate,
  endDate,
}) => {
  const response = await api.get("/earnings/details", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};
