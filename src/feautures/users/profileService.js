import { supabase } from "@/lib/supabaseClient";

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
export async function getStaff(userId) {
  const { data, error } = await supabase
    .from("staff_details")
    .select("profile_id, location_id")
    .eq("profile_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
