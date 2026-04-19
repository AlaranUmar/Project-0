import { supabase } from "@/lib/supabaseClient";

export async function getRecentAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .limit(5)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
// getAlerts();
// createAlert();
// markAlertRead();
// deleteAlert();
