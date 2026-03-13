import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useReports(startDate, endDate, type = "owner") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    const fetchReports = async () => {
      try {
        let response;
        if (type === "owner") {
          const { data, error } = await supabase.rpc("get_owner_reports", {
            start_date: startDate,
            end_date: endDate,
          });
          if (error) throw error;
          response = data;
        } else if (type === "financial") {
          const { data, error } = await supabase.rpc("get_daily_financials", {
            start_date: startDate,
            end_date: endDate,
          });
          if (error) throw error;
          response = data;
        }
        setData(response);
      } catch (err) {
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [startDate, endDate, type]);

  return { data, loading, error };
}
