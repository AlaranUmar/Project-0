import { supabase } from "@/lib/supabaseClient";

export async function getBranches() {
  const { data, error } = await supabase.from("branch_staff_view").select("*");
  if (error) throw error;
  return data;
}
export async function getBranchDetails(id) {
  const { data: summary, error: summaryError } = await supabase
    .from("branch_summary")
    .select("*")
    .eq("location_id", id)
    .single();

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
