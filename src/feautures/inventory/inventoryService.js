import { supabase } from "@/lib/supabaseClient";

export async function getRecentStockMovements() {
  const { data, error } = await supabase
    .from("vw_stock_movements")
    .select("*")
    .limit(5)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
