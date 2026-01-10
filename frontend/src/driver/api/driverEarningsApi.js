import axios from "../../utils/axios";

export const fetchDriverEarnings = async () => {
  const res = await axios.get("/drivers/earnings");
  return res.data;
};
