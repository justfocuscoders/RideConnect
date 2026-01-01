export const getProfileProgress = (user) => {
  if (!user) {
    return {
      completed: 0,
      total: 3,
      missing: ["name", "phone", "email"],
    };
  }

  const fields = [
    { key: "email", label: "Email" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
  ];

  const completedFields = fields.filter(
    (field) => Boolean(user[field.key])
  );

  const missingFields = fields
    .filter((field) => !user[field.key])
    .map((field) => field.label);

  return {
    completed: completedFields.length,
    total: fields.length,
    missing: missingFields,
  };
};
