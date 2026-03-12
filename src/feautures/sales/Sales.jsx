import { supabase } from "@/lib/supabaseClient";

export async function getSales() {
  const { data, error } = await supabase
    .from("sales_with_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
export function sumSales(sales) {
  return sales.reduce((total, sale) => total + sale.amount, 0);
}
