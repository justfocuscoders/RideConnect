import axios from "../../utils/axios";

export const createDriverProfile = async (payload) => {
  const res = await axios.post("/drivers/profile", payload);
  return res.data;
};
