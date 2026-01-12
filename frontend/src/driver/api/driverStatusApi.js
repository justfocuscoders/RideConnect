import api from "../../services/api";

// Read current driver status
export const getDriverStatus = async () => {
  const res = await api.get("/profile/me");
  return { is_online: res.data.is_online };
};

// Update status
export const updateDriverStatus = async (isOnline) => {
  if (isOnline) {
    await api.patch("/online");
  } else {
    await api.patch("/offline");
  }
  return { is_online: isOnline };
};
