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

export async function getSaleDetails(saleId) {
  const { data, error } = await supabase.rpc("get_sale_details", {
    p_sale_id: saleId,
  });

  if (error) throw error;

  return data?.[0] || null;
}

export async function getSaleItems(saleId) {
  const { data, error } = await supabase.rpc("get_sale_items", {
    p_sale_id: saleId,
  });

  if (error) throw error;

  return data || [];
}
