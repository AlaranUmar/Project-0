import { supabase } from "@/lib/supabaseClient";

export async function getUserRole() {
  const { data, error } = await supabase.rpc("get_user_role");
  if (error) console.error(error);
  else return data;
}

export async function getUserLocation() {
  const { data, error } = await supabase.rpc("get_user_location");
  if (error) console.error(error);
  else return data;
}
