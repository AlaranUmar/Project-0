import { supabase } from "@/lib/supabaseClient";

export async function getLocations() {
  const { data, error } = await supabase.from("locations").select("*");
  if (error) throw error;
  return data;
}
export async function getBranchDashboardSummary() {
  const { data, error } = await supabase
    .from("branch_dashboard_summary")
    .select("*");
  if (error) throw error;
  return data;
}

export async function getBranchDetails(id) {
  const { data: summary, error: summaryError } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();
  console.log(summary);
  if (summaryError) throw summaryError;

  const [rev, exp, stock] = await Promise.all([
    supabase.rpc("get_branch_revenue", { p_location_id: id }),
    supabase.rpc("get_branch_expenses", { p_location_id: id }),
    supabase.rpc("get_branch_stock_value", { p_location_id: id }),
  ]);

  return {
    ...summary,
    revenue: rev.data,
    expenses: exp.data,
    stockVal: stock.data,
  };
}
export async function getWarehouseLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("type", "warehouse");

  if (error) throw error;
  return data;
}
