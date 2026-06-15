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
export async function getMyLocation() {
  const { data, error } = await supabase.rpc("get_my_location");

  if (error) throw error;

  return data?.[0] || null;
}
