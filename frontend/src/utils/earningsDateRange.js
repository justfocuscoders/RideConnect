export const getDateRangeFromSelection = (selection) => {
  const today = new Date();
  const endDate = new Date(today);

  let startDate = new Date(today);

  switch (selection) {
    case "today":
      // startDate = today
      break;

    case "7d":
      startDate.setDate(today.getDate() - 6);
      break;

    case "30d":
      startDate.setDate(today.getDate() - 29);
      break;

    case "6m":
      startDate.setMonth(today.getMonth() - 6);
      break;

    case "1y":
      startDate.setFullYear(today.getFullYear() - 1);
      break;

    default:
      // custom handled separately
      break;
  }

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
};
