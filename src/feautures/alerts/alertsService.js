import { supabase } from "@/lib/supabaseClient";

export async function getRecentAlerts() {
  const { data, error } = await supabase
    .from("alert_details_view") // Query the view
    .select("*")
    .limit(5)
    .order("created_at", { ascending: false })
    .eq("status", "active");

  if (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
  return data;
}

// getAlerts();
// createAlert();
// markAlertRead();
// deleteAlert();
