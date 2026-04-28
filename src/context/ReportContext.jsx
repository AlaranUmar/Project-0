import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useReports(
  startDate,
  endDate,
  selectedBranch = "all",
  view = "day", // today, week, month, year
) {
  const [summary, setSummary] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    let isMounted = true;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        // 🔹 Determine bucket dynamically
        let bucket = "day";
        if (view === "today") bucket = "hour";
        else if (view === "week") bucket = "day";
        else if (view === "month") bucket = "day";
        else if (view === "year") bucket = "month";

        // 🔹 Parallel requests (faster)
        const [dashboardRes, timelineRes] = await Promise.all([
          supabase.rpc("get_owner_dashboard", {
            start_date: startDate,
            end_date: endDate,
            selected_branch: selectedBranch,
          }),
          supabase.rpc("get_sales_timeline", {
            start_date: startDate,
            end_date: endDate,
            bucket,
          }),
        ]);

        if (dashboardRes.error) throw dashboardRes.error;
        if (timelineRes.error) throw timelineRes.error;

        if (isMounted) {
          setSummary(dashboardRes.data || []);
          setTimeline(timelineRes.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(err);
          setSummary([]);
          setTimeline([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate, selectedBranch, view]);

  // 🔹 Derived values (lightweight, safe)
  const totals = summary.reduce(
    (acc, b) => {
      acc.sales += Number(b.total_sales || 0);
      acc.expenses += Number(b.total_expenses || 0);
      acc.profit += Number(b.profit || 0);
      acc.inventory += Number(b.inventory_value || 0);
      return acc;
    },
    { sales: 0, expenses: 0, profit: 0, inventory: 0 },
  );

  return {
    summary,
    timeline,
    totals,
    loading,
    error,
  };
}
