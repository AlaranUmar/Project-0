export function getDateRange(range) {
  const today = new Date();
  let start, end;

  switch (range) {
    case "today":
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
      break;

    case "week": {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

      start = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
      break;
    }

    case "month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      break;

    case "total":
      start = new Date(2000, 0, 1); // very early date
      end = new Date(today.setHours(23, 59, 59, 999));
      break;

    default:
      start = today;
      end = today;
  }

  const formatDate = (d) => d.toISOString().split("T")[0];
  return [formatDate(start), formatDate(end)];
}
