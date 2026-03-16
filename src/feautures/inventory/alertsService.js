import { supabase } from "@/lib/supabaseClient";

export async function getRecentAlerts() {
  const { data, error } = await supabase
    .from("alerts_view")
    .select("*")
    .limit(5)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
