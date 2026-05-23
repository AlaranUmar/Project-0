export function getDateRange(range) {
  const now = new Date();
  let start = new Date(now.getTime());
  let end = new Date(now.getTime());

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case "week": {
      const day = now.getDay();
      // Adjust to Monday of the current week safely
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case "total":
      start = new Date(2000, 0, 1, 0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    default:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
  }

  /**
   * Formats the timestamp using local system values
   * so time structures reach Supabase intact.
   */
  const formatLocalTimestamp = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    const secs = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${mins}:${secs}`;
  };

  return [formatLocalTimestamp(start), formatLocalTimestamp(end)];
}
