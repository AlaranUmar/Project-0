import { supabase } from "@/lib/supabaseClient";

export async function getStaffs() {
  const { data, error } = await supabase.from("owner_staff_view").select("*");
  if(error) throw error
  return data;
}
