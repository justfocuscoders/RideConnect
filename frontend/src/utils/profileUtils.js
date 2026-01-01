export const isProfileComplete = (user) => {
  if (!user) return false;
  return Boolean(user.name && user.phone);
};
