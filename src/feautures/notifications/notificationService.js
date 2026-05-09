import { supabase } from "@/lib/supabaseClient";

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      alerts (
        alert_type,
        product_id,
        location_id
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
