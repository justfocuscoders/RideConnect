import api from "./api";

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updateProfile = (data) => {
  return api.put("/users/me", data);
};
