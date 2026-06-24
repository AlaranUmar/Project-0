import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useReports(
  startDate,
  endDate,
  selectedBranch = null,
  view = "day",
) {
  const [summary, setSummary] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [cashierSales, setCashierSales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate || selectedBranch === undefined) return;

    let isMounted = true;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine timeline bucket
        let bucket = "day";

        if (view === "today") {
          bucket = "hour";
        } else if (view === "week") {
          bucket = "day";
        } else if (view === "month") {
          bucket = "day";
        } else if (view === "year") {
          bucket = "month";
        } else if (view === "total") {
          bucket = "month";
        } else if (view === "custom") {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

          if (diffDays <= 1) bucket = "hour";
          else if (diffDays > 90) bucket = "month";
          else bucket = "day";
        }

        const [dashboardRes, timelineRes, cashierRes] = await Promise.all([
          supabase.rpc("get_owner_dashboard", {
            p_start_date: startDate,
            p_end_date: endDate,
            p_selected_branch: selectedBranch,
          }),

          supabase.rpc("get_sales_timeline", {
            p_start_date: startDate,
            p_end_date: endDate,
            p_bucket: bucket,
            p_selected_branch: selectedBranch,
          }),

          supabase.rpc("get_cashiers_sales_ranking", {
            p_location_id: selectedBranch,
            p_start_date: startDate,
            p_end_date: endDate,
          }),
        ]);

        if (dashboardRes.error) throw dashboardRes.error;
        if (timelineRes.error) throw timelineRes.error;
        if (cashierRes.error) throw cashierRes.error;

        if (isMounted) {
          setSummary(dashboardRes.data || []);
          setTimeline(timelineRes.data || []);
          setCashierSales(cashierRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching reports inside hook:", err);

        if (isMounted) {
          setError(err);
          setSummary([]);
          setTimeline([]);
          setCashierSales([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate, selectedBranch, view]);

  const totals = summary.reduce(
    (acc, branch) => {
      acc.sales += Number(branch.total_sales || 0);
      acc.expenses += Number(branch.total_expenses || 0);
      acc.profit += Number(branch.profit || 0);
      acc.inventory += Number(branch.inventory_value || 0);

      return acc;
    },
    { sales: 0, expenses: 0, profit: 0, inventory: 0 },
  );

  return {
    summary,
    timeline,
    cashierSales,
    totals,
    loading,
    error,
  };
}
