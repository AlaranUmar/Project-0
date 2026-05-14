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
      // Adjusts to Monday of the current week
      firstDayOfWeek.setDate(
        today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
      );
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
      start = new Date(2000, 0, 1);
      end = new Date(today.setHours(23, 59, 59, 999));
      break;

    default:
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));
  }

  /**
   * Helper to format date as YYYY-MM-DD using local time
   * to avoid timezone shifts caused by toISOString()
   */
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return [formatDate(start), formatDate(end)];
}
