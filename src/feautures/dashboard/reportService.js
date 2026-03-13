import { supabase } from "@/lib/supabaseClient";

export async function getReports(startDate, endDate) {
  const { data, error } = await supabase.rpc("get_owner_reports", {
    start_date: startDate,
    end_date: endDate,
  });
  if (error) return error;
  return data;
}

export async function getFinancials(startDate, endDate) {
  const { data, error } = await supabase.rpc("get_daily_financials", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) return [];
  return data;
}
