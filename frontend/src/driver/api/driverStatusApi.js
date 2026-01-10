import api from "../../services/api";

// Read current driver status
export const getDriverStatus = async () => {
  const res = await api.get("/drivers/profile/me");
  return { is_online: res.data.is_online };
};

// Update status
export const updateDriverStatus = async (isOnline) => {
  if (isOnline) {
    await api.patch("/drivers/online");
  } else {
    await api.patch("/drivers/offline");
  }
  return { is_online: isOnline };
};
