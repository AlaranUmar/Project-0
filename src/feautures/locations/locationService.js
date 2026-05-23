import { supabase } from "@/lib/supabaseClient";

export async function getLocations() {
  const { data, error } = await supabase.from("locations").select("*");

  if (error) throw error;

  return data;
}

export async function getLocationOverview(id) {
  const { data, error } = await supabase.rpc("get_location_overview", {
    p_location_id: id,
  });

  if (error) throw error;

  return data;
}

export async function getLocationSales(id, limit = 20) {
  const { data, error } = await supabase.rpc("get_location_sales", {
    p_location_id: id,
    p_limit: limit,
  });

  if (error) throw error;

  return data;
}

export async function getLocationStaff(id) {
  const { data, error } = await supabase.rpc("get_location_staff", {
    p_location_id: id,
  });

  if (error) throw error;

  return data;
}

export async function getLocationInventory(id) {
  const { data, error } = await supabase.rpc("get_location_inventory", {
    p_location_id: id,
  });

  if (error) throw error;

  return data;
}

export async function getLocationTransfers(id) {
  const { data, error } = await supabase.rpc("get_location_transfers", {
    p_location_id: id,
  });

  if (error) throw error;

  return data;
}

export async function getRestockRecommendations(id) {
  const { data, error } = await supabase.rpc("get_restock_recommendations", {
    p_location_id: id,
  });

  if (error) throw error;

  return data;
}
export async function getLocationsByType(type) {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("type", type);

  if (error) throw error;

  return data;
}
export async function getLocationsDashboardSummary() {
  const { data, error } = await supabase
    .from("location_dashboard_summary")
    .select("*");

  if (error) throw error;

  return data;
}
