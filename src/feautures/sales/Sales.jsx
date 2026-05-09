import { supabase } from "@/lib/supabaseClient";

export async function getSales() {
  const { data, error } = await supabase
    .from("sales_summary_view")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sales:", error);
    return [];
  }
  return data;
}

/**
 * Safely sums the total amount of sales.
 * Uses the 'amount' column directly from the sales table.
 */
export function sumSales(sales) {
  if (!sales) return 0;
  return sales.reduce((total, sale) => total + Number(sale.amount || 0), 0);
}
