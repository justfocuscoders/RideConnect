import api from "../../services/api";

export const fetchDriverEarnings = async () => {
  const res = await api.get("/earnings");
  return res.data;
};

export const fetchDriverEarningsDetails = async ({ startDate, endDate }) => {
  const res = await api.get("/earnings/details", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
  return res.data;
};
